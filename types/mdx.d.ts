declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
}

declare module '@/content/*.mdx' {
  let MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
}