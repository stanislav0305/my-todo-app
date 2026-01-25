import { RootPersistStorage } from '@app/model/configure-store'
import { Dispatch, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { PersistPartial } from 'redux-persist/lib/persistReducer'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export type AppDispatchType = ThunkDispatch<
    RootPersistStorage & PersistPartial,
    undefined,
    UnknownAction
> &
    Dispatch<UnknownAction>
