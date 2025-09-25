// types/index.ts

// export type Prayer = {
//   id: string
//   user_id: string
//   created_at: string
//   updated_at: string
//   title: string
//   details: string | null
//   status: 'active' | 'answered'
// }

// export type User = {
//   id: string
//   email: string
// }
// types/index.ts
export type Prayer = {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  title: string
  details: string | null
  status: 'active' | 'answered'
}