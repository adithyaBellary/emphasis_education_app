export const getData = (_id: number): {id: number, content: string} => (
  _id === 1 ? (
    {
      id: _id,
      content: 'heyyyy'
    }
  ) :
  (
    {
      id: _id,
      content: 'byeeee'
    }
  )
);