import { IPagePath } from '../interfaces/IPagePath'
import { promises as fs } from 'fs'
import path from 'path'

// see https://github.com/vercel/examples/tree/main/solutions/reuse-responses
const getPathFromCache = async (pagePath: string): Promise<IPagePath> => {
	const data = await fs.readFile(path.join(process.cwd(), 'paths.db'))
	const paths: IPagePath[] = JSON.parse(data as unknown as string)
	return paths.find(p => p.path === pagePath)
}

const setPathsIntoCache = async (paths: IPagePath[]) => {
	return fs.writeFile(path.join(process.cwd(), 'paths.db'), JSON.stringify(paths))
}

export { getPathFromCache, setPathsIntoCache }
