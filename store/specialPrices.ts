import { defineStore } from 'pinia'

export const useSpecialPriceStore = defineStore('specialPrice', {
    state: () => ({
        data: [
            {
                "id": "61784b33-9ebd-4e82-8a4d-c914c92b24d9",
                "house_id": "bb2ded1a-9e33-4351-8837-4e5f396894ce",
                "date": "2024-05-15",
                "special_price": 848.79,
                "price_type": "partial"
            },
            {
                "id": "8ff6f5d1-1a52-4624-9f4d-2bd13bf67e59",
                "house_id": "bb2ded1a-9e33-4351-8837-4e5f396894ce",
                "date": "2024-06-23",
                "special_price": 48.79,
                "price_type": "whole"
            },
            {
                "id": "c0985599-dbf0-480b-acc1-09df5c0698bf",
                "house_id": "bb2ded1a-9e33-4351-8837-4e5f396894ce",
                "date": "2024-03-19",
                "special_price": 862.5,
                "price_type": "whole"
            }
        ],
        nextId: 1,
    }),
    getters: {
        getList: (state) => state.data,
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
        },
        deleteItem(el: any) {
            const index = this.data.findIndex((item: any) => item.id === el?.id);
            if (index !== -1) {
                this.data.splice(index, 1);
            } else {
                console.warn(`The item not found.`);
            }
        },
    },
})
