<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Data Aset </h3>

        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Cari"
                    single-line
                    hide-details>
                </v-text-field>

                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true">Tambah</v-btn>  

            </v-card-title>
            <v-data-table :headers="headers" :items="asets" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">ubah</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">hapus</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Aset </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_mobil" label="Nama Mobil" required></v-text-field>
                        <v-text-field v-model="form.tipe_mobil" label="Tipe Mobil" required></v-text-field>
                        <v-text-field v-model="form.jenis_transmisi" label="Jenis Transmisi" required></v-text-field>
                        <v-text-field v-model="form.volume_bahan_bakar" label="Volume Bahan Bakar" required></v-text-field>
                        <v-text-field v-model="form.warna_mobil" label="Warna Mobil" required></v-text-field>
                        <v-text-field v-model="form.kapasitas_mobil" label="Kapasitas Mobil" required></v-text-field>
                        <v-text-field v-model="form.fasilitas_mobil" label="Fasilitas Mobil" required></v-text-field>
                        <v-text-field v-model="form.plat_nomor" label="Plat Nomor" required></v-text-field>
                        <v-text-field v-model="form.no_stnk" label="No STNK" required></v-text-field>
                        <v-select v-model="form.kategori_aset" :items=itemsKategoriAset label="Kategori Aset" required></v-select>
                        <datepicker v-model="form.tgl_service_akhir" class="mb-2" :max="max" size="sm" placeholder="Tgl Service Akhir"></datepicker>
                        <p></p>
                        <v-select v-model="form.status_ketersediaan" :items=itemsStatusTersedia label="Status Tersedia" required></v-select>
                        <v-text-field v-model="form.biaya_sewa" label="Biaya Sewa" required></v-text-field>
                        <v-text-field v-model="form.id_mitra" label="Id Mitra"></v-text-field>
                        <p></p>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-l" text @click="cancel">Batal</v-btn>
                    <v-btn color="blue darken-l" text @click="setForm">Simpan</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>
                <v-card-text>Anda Yakin ingin menghapus aset ini?</v-card-text>
                <v-card-action>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">Batal</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData">Hapus</v-btn>
                </v-card-action>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
    export default {
        name: "List",
        components: {
            Datepicker
        },
        data() {
            return {
                status_ketersediaan: '',
                kategori_aset: '',
                tgl_service_akhir: new Date(),
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                itemsStatusTersedia : ["Tersedia", "Tidak Tersedia"],
                itemsKategoriAset : ["Pribadi", "Mitra"],
                headers: [
                    { text: "Nama Mobil", align: "start", sortable: true, value: "nama_mobil"},
                    { text: "Tipe Mobil", value: "tipe_mobil"},
                    { text: "Jenis Transmisi", value: "jenis_transmisi"},
                    { text: "Volume Bahan Bakar", value: "volume_bahan_bakar"},
                    { text: "Warna Mobil", value: "warna_mobil"},
                    { text: "Kapasitas Mobil", value: "kapasitas_mobil"},
                    { text: "Fasilitas Mobil", value: "fasilitas_mobil"},
                    { text: "Plat Nomor", value: "plat_nomor"},
                    { text: "No STNK", value: "no_stnk"},
                    { text: "Kategori Aset", value: "kategori_aset"},
                    { text: "Tgl Service Akhir", value: "tgl_service_akhir"},
                    { text: "Status Ketersediaan", value: "status_ketersediaan"},
                    { text: "Biaya Sewa", value: "biaya_sewa"},
                    { text: "Id Mitra", value: "id_mitra"},
                    { text: "*", value: "actions"},
                ],
                aset: new FormData,
                asets: [],
                form: {
                    nama_mobil: null,
                    tipe_mobil: null,
                    jenis_transmisi: null,
                    volume_bahan_bakar: null,
                    warna_mobil: null,
                    kapasitas_mobil: null,
                    fasilitas_mobil: null,
                    plat_nomor: null,
                    no_stnk: null,
                    kategori_aset: null,
                    tgl_service_akhir: null,
                    status_ketersediaan: null,
                    biaya_sewa: null,
                    actions: null,
                },
                deleteId: '',
                editId: ''
            };
        },

        methods: {
            setForm(){
                if(this.inputType !== 'Tambah'){
                    this.update();
                }else{
                    this.save();
                }
            },

            readData(){
                var url = this.$api + '/aset';
                this.$http.get(url, {
                    // headers: {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    // }
                }).then(response => {
                    this.asets = response.data.data;
                })
            },

            save(){
                this.aset.append('nama_mobil', this.form.nama_mobil);
                this.aset.append('tipe_mobil', this.form.tipe_mobil);
                this.aset.append('jenis_transmisi', this.form.jenis_transmisi);
                this.aset.append('volume_bahan_bakar', this.form.volume_bahan_bakar);
                this.aset.append('warna_mobil', this.form.warna_mobil);
                this.aset.append('kapasitas_mobil', this.form.kapasitas_mobil);
                this.aset.append('fasilitas_mobil', this.form.fasilitas_mobil);
                this.aset.append('plat_nomor', this.form.plat_nomor);
                this.aset.append('no_stnk', this.form.no_stnk);
                this.aset.append('kategori_aset', this.form.kategori_aset);
                this.aset.append('tgl_service_akhir', this.form.tgl_service_akhir);
                this.aset.append('status_ketersediaan', this.form.status_ketersediaan);
                this.aset.append('biaya_sewa', this.form.biaya_sewa);
                this.aset.append('id_mitra', this.form.id_mitra);

                var url = this.$api + '/aset'
                this.load = true;
                this.$http.post(url, this.aset, {
                    // headers: {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    // }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = true;
                    this.close();
                    this.readData();
                    this.resetForm();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            update() {
                let newData = {
                    nama_mobil : this.form.nama_mobil,
                    tipe_mobil : this.form.tipe_mobil,
                    jenis_transmisi : this.form.jenis_transmisi,
                    volume_bahan_bakar : this.form.volume_bahan_bakar,
                    warna_mobil : this.form.warna_mobil,
                    kapasitas_mobil : this.form.kapasitas_mobil,
                    fasilitas_mobil : this.form.fasilitas_mobil,
                    plat_nomor : this.form.plat_nomor,
                    no_stnk : this.form.no_stnk,
                    kategori_aset : this.form.kategori_aset,
                    tgl_service_akhir : this.form.tgl_service_akhir,
                    status_ketersediaan : this.form.status_ketersediaan,
                    biaya_sewa : this.form.biaya_sewa,
                    id_mitra : this.form.id_mitra,
                };
                var url = this.$api + '/aset/' + this.editId;
                this.load = true;
                this.$http.put(url, newData, {
                    // headers : {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    // }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            deleteData() {
                var url = this.$api + '/aset/' + this.deleteId;
                this.load = true;
                this.$http.delete(url, {
                    // headers : {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    // }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id;
                this.form.nama_mobil = item.nama_mobil;
                this.form.tipe_mobil = item.tipe_mobil;
                this.form.jenis_transmisi = item.jenis_transmisi;
                this.form.volume_bahan_bakar = item.volume_bahan_bakar;
                this.form.warna_mobil = item.warna_mobil;
                this.form.kapasitas_mobil = item.kapasitas_mobil;
                this.form.fasilitas_mobil = item.fasilitas_mobil;
                this.form.plat_nomor = item.plat_nomor;
                this.form.no_stnk = item.no_stnk;
                this.form.kategori_aset = item.kategori_aset;
                this.form.tgl_service_akhir = item.tgl_service_akhir;
                this.form.status_ketersediaan = item.status_ketersediaan;
                this.form.biaya_sewa = item.biaya_sewa;
                this.form.id_mitra = item.id_mitra;
                this.dialog = true;
            },

            deleteHandler(id) {
                this.deleteId = id;
                this.dialogConfirm = true;
            },
            close() {
                this.dialog = false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
                this.readData();
            },
            cancel() {
                this.resetForm();
                this.readData();
                this.dialog = false;
                this.dialogConfirm = false;
                this.inputType = 'Tambah';
            },
            resetForm() {
                this.form = {
                    nama_mobil: null,
                    tipe_mobil: null,
                    jenis_transmisi: null,
                    volume_bahan_bakar: null,
                    warna_mobil: null,
                    kapasitas_mobil: null,
                    fasilitas_mobil: null,
                    plat_nomor: null,
                    no_stnk: null,
                    kategori_aset: null,
                    tgl_service_akhir: null,
                    status_ketersediaan: null,
                    biaya_sewa: null,
                };
            },
        },
        computed: {
            formTitle() {
                return this.inputType;
            },
        },
        mounted() {
            this.readData();
        },
    };
</script>