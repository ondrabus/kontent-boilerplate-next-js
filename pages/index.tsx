import styles from '../styles/Home.module.css'
import { GetStaticProps } from 'next';
import { HeroModel } from '../models/HeroModel';
import KontentService from '../services/KontentService';

export const getStaticProps: GetStaticProps<HeroModel> = async ({ params }) => {
  const heroItem = await KontentService.Instance().deliveryClient
    .item<HeroModel>('hero')
    .toPromise()

  return {
    props: heroItem.data.item
  }
}

const HomePage: React.FC<HeroModel> = (model) => {
  return (
    <main >
      <div className={styles.hero}>
        <h1 className="append-dot">{model.elements.headline.value}</h1>
        <div className={styles.summary} dangerouslySetInnerHTML={{ __html: model.elements.summary.value }}>
        </div>
        <div className="button">
          <a href={model.elements.ctaUrl.value}>{model.elements.ctaLabel.value}</a>
        </div>
      </div>
    </main>
  )
}

export default HomePage