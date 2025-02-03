import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { store } from '../store';
import { usersApiSlice } from '../Users/usersApiSlice';

export const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate('User'))

        return () => {
            console.log('unsubscribing')
         
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}
