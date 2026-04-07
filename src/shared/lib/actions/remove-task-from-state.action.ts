import { createAction, PayloadAction } from "@reduxjs/toolkit"


export const removeTaskFromState = createAction('REMOVE_TASK_STATE', (id: number) => {
    return { payload: id } as PayloadAction<number>
})