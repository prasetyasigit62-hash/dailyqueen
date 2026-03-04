export interface Floor {
    nama: string;
    image: string;
    tenant: {
        id: number;
        nama: string;
        gambarTenant: string;
        id_kategori: number;
        id_lantai: number;
        id_lokasi: number;
        kategori: {
            id: number;
            nama: string;
        };
        lantai: {
            id: number;
            nama: string;
        };
        lokasi: {
            id: number;
            nama_mall: string;
        };
    }[];
}

export type mallDirectoryInterface = {
    [key: string]: Floor[];
};
