export type tenantInterface = {
    id: number;
    id_lokasi: string;
    id_lantai: string;
    nama: string;
    gambarTenant: string;
    thumbnail: string;
    description: string;
    lokasi: {
        id: number;
        nama_mall: string;
    };
    lantai: {
        id: number;
        nama: string;
    };
};
