export type promoInterface = {
    id: number;
    nama: string;
    id_mall: string;
    id_tenant: string;
    kode_promo: string;
    deskripsi: string;
    simpleDescription: string;
    image: string;
    tanggal_mulai: string;
    tanggal_berakhir: string;
    tenant: {
        id: number;
        nama: string;
    };
    mall: {
        id: number;
        nama_mall: string;
    };
};
