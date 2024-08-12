
import { defineStore } from 'pinia'

export const useSpecialTimingStore = defineStore('specialTiming', {
    state: () => ({
        data:   [
            {
                "id": "83aca7c7-1ae6-4694-a3f4-33710fcb0190",
                "house_id": "bb2ded1a-9e33-4351-8837-4e5f396894ce",
                "date": "2024-04-20",
                "start_time": "2024-01-13T06:44:04",
                "end_time": "2024-03-30T17:01:51"
            },
            {
                "id": "0a3d82da-0538-46c6-8cc0-8377091df77c",
                "house_id": "bb2ded1a-9e33-4351-8837-4e5f396894ce",
                "date": "2024-05-27",
                "start_time": "2024-04-18T20:22:14",
                "end_time": "2024-02-27T18:24:19"
            },
            {
                "id": "20c48e64-d1f2-42f2-b315-52bd0f963b1a",
                "house_id": "bb2ded1a-9e33-4351-8837-4e5f396894ce",
                "date": "2024-06-18",
                "start_time": "2024-01-25T03:59:37",
                "end_time": "2024-04-13T00:45:33"
            }
        ],
        nextId: 1,
    }),
    getters: {
        getList: (state) => state.data
    },
    actions: {
        addSpecialPrice(item:any) {
            const exists = this.data.some((existingItem:any) => existingItem?.id === item?.id);

            if (!exists) {
                if (!item.id) {
                    item.id = this.nextId++;
                }
                this.data.push(item);
            } else {
                console.warn(`Item with id ${item.id} already exists.`);
            }
        },
        updateSpecialPrice(el:any) {
            let index = this.data.findIndex((item:any) => item?.id === el?.id);
            if (index !== -1) {
                this.data[index] = el;
            } else {
                console.warn(`Item with id ${el.id} not found.`);
            }
        }
    },
})
