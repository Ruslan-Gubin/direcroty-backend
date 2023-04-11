interface IImage {
  public_id: string
  url: string
}


interface IPost {
  category: string;
  _id: string;
  title: string;
  text: string;
  image: IImage[]
  viewsCount: number
  updatedAt: string
  __v: number
}

export type {IPost}