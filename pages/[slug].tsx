import styles from '../styles/Home.module.css'
import { ConferenceModel } from '../models/ConferenceModel';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { projectModel } from '../models/_project';
import KontentService from '../services/KontentService';
import { IPagePath } from '../interfaces/IPagePath';
import { getPathFromCache, setPathsIntoCache } from '../services/CacheService';


export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await KontentService.Instance().deliveryClient
    .items<ConferenceModel>()
    .type(projectModel.contentTypes.conference.codename)
    .elementsParameter([
      projectModel.contentTypes.conference.elements.url_slug.codename,
      projectModel.contentTypes.conference.elements.url_slug_history.codename,
    ])
    .toPromise()

  const allPaths: IPagePath[] = [].concat(...paths.data.items.map(item => [
    {
      path: item.elements.urlSlug.value
    },
    ...(JSON.parse(item.elements.urlSlugHistory.value) as string[]).map(slug => ({
      path: slug,
      redirectsTo: item.elements.urlSlug.value
    }))
  ]))

  await setPathsIntoCache(allPaths)

  return {
    paths: allPaths.map(path => ({ params: { slug: path.path } })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<ConferenceModel> = async ({ params }) => {
  const path = await getPathFromCache(params.slug.toString())

  if (path.redirectsTo){
    return {
      redirect: {
        destination: `/${path.redirectsTo}`,
        permanent: true
      }
    }
  }

  const conference = await KontentService.Instance().deliveryClient
    .items<ConferenceModel>()
    .type(projectModel.contentTypes.conference.codename)
    .equalsFilter(`elements.${projectModel.contentTypes.conference.elements.url_slug.codename}`, params.slug.toString())
    .limitParameter(1)
    .toPromise()

  return {
    props: conference.data.items[0]
  }
}

const ConferencePage: React.FC<ConferenceModel> = (model) => {
  const router = useRouter()

  return (
    <main >
      <div className={styles.hero}>
        <h1 className="append-dot">{model.elements.title.value}</h1>
        <div className={styles.summary} dangerouslySetInnerHTML={{ __html: model.elements.title.value }}>
        </div>
        <div className="button">Current slug: {router.query.slug}</div>
      </div>
    </main>
  )
}

export default ConferencePage