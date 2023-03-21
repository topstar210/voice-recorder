const localstore = {
    saveObj: (item:string, ary:any) => {
        return localStorage.setItem(item, JSON.stringify(ary));
    },

    getObj: (item:string) => {
        return JSON.parse( localStorage?.item );
    },
}

export default localstore;