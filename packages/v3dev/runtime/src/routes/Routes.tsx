import { useRoutes } from 'react-router-dom'

// 该文件自动生成
import routes from '../assets/__vdev__/vdev.routes'

export function Routes() {
  return useRoutes([...routes])
}
