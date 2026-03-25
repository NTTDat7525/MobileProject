// import { useEffect } from 'react';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../hooks/useAuth';

// export default function Index() {
//   const router = useRouter();
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     if (!loading) {
//       if (!user) {

//         router.replace('/screens/Signin');
//       } else {

//         const userRole = user.role || 'user';
//         if (userRole === 'admin' || userRole === 'Admin') {
//           router.replace('/admin');
//         } else {
//           router.replace('/user');
//         }
//       }
//     }
//   }, [loading, user]);

//   return null;
// }
