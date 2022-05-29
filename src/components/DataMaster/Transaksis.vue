<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Data Transaksi </h3>

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
            <v-data-table :headers="headers" :items="transaksis" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">ubah</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">hapus</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Transaksi </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.no_ktp" label="No KTP" required></v-text-field>
                        <v-text-field v-model="form.no_sim" label="No SIM" required></v-text-field>
                        <datepicker v-model="form.tgl_transaksi" class="mb-2" :max="max" size="sm" placeholder="Tgl Transaksi"></datepicker>
                        <p></p>
                        <datepicker v-model="form.tgl_mulai_sewa" class="mb-2" :max="max" size="sm" placeholder="Tgl Mulai Sewa"></datepicker>
                        <p></p>
                        <datepicker v-model="form.tgl_selesai_sewa" class="mb-2" :max="max" size="sm" placeholder="Tgl Selesai Sewa"></datepicker>
                        <p></p>
                        <v-select v-model="form.metode_pembayaran" :items=itemsMetodePembayaran label="Metode Pembayaran" required></v-select>
                        <v-text-field v-model="form.total_biaya_sewa" label="Total Biaya" required></v-text-field>
                        <v-text-field v-model="form.ekstensi_biaya" label="Ekstensi Biaya" required></v-text-field>
                        <v-select v-model="form.status_transaksi" :items=itemsStatusTransaksi label="Status Transaksi" required></v-select>
                        <v-select v-model="form.status_verifikasi" :items=itemsStatusVerifikasi label="Status Verifikasi" required></v-select>
                        <v-text-field v-model="form.id_customer" label="ID Customer" required></v-text-field>
                        <v-text-field v-model="form.id_driver" label="ID Driver" required></v-text-field>
                        <v-text-field v-model="form.id_pegawai" label="ID Pegawai" required></v-text-field>
                        <v-text-field v-model="form.id_aset" label="ID Aset" required></v-text-field>
                        <v-text-field v-model="form.id_promo" label="ID Promo" required></v-text-field>
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
                <v-card-text>Anda Yakin ingin menghapus transaksi ini?</v-card-text>
                <v-card-action>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">Batal</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData">Simpan</v-btn>
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
                metode_pembayaran: '',
                status_transaksi: '',
                status_verifikasi: '',
                tgl_transaksi: new Date(),
                tgl_mulai_sewa: new Date(),
                tgl_selesai_sewa: new Date(),
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                itemsMetodePembayaran: ["Tunai", "Non-Tunai"],
                itemsStatusTransaksi: [ "Belum Bayar" , "Sudah Bayar" ],
                itemsStatusVerifikasi : ["Belum Verifikasi", "Sudah Verifikasi"],
                headers: [
                    { text: "No KTP", align: "start", sortable: true, value: "no_ktp"},
                    { text: "No SIM", value: "no_sim"},
                    { text: "Tgl Transaksi", value: "tgl_transaksi"},
                    { text: "Tgl Mulai Sewa", value: "tgl_mulai_sewa"},
                    { text: "Tgl Selesai Sewa", value: "tgl_selesai_sewa"},
                    { text: "Metode Pembayaran", value: "metode_pembayaran"},
                    { text: "Total Biaya Sewa", value: "total_biaya_sewa"},
                    { text: "Ekstensi Biaya", value: "ekstensi_biaya"},
                    { text: "Status Transaksi", value: "status_transaksi"},
                    { text: "Status Verifikasi", value: "status_verifikasi"},
                    { text: "Customer", value: "id_customer"},
                    { text: "Driver", value: "id_driver"},
                    { text: "Pegawai", value: "id_pegawai"},
                    { text: "Aset", value: "id_aset"},
                    { text: "Promo", value: "id_promo"},
                    { text: "*", value: "actions"},
                ],
                transaksi: new FormData,
                transaksis: [],
                form: {
                    no_ktp: null,
                    no_sim: null,
                    tgl_transaksi: null,
                    tgl_mulai_sewa: null,
                    tgl_selesai_sewa: null,
                    metode_pembayaran: null,
                    total_biaya_sewa: null,
                    ekstensi_biaya: null,
                    status_transaksi: null,
                    status_verifikasi: null,
                    id_customer: null,
                    id_driver: null,
                    id_pegawai: null,
                    id_aset: null,
                    id_promo: null,
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
                var url = this.$api + '/transaksi';
                this.$http.get(url, {
                    // headers: {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    // }
                }).then(response => {
                    this.transaksis = response.data.data;
                })
            },

            save(){
                this.transaksi.append('no_ktp', this.form.no_ktp);
                this.transaksi.append('no_sim', this.form.no_sim);
                this.transaksi.append('tgl_transaksi', this.form.tgl_transaksi);
                this.transaksi.append('tgl_mulai_sewa', this.form.tgl_mulai_sewa);
                this.transaksi.append('tgl_selesai_sewa', this.form.tgl_selesai_sewa);
                this.transaksi.append('metode_pembayaran', this.form.metode_pembayaran);
                this.transaksi.append('total_biaya_sewa', this.form.total_biaya_sewa);
                this.transaksi.append('ekstensi_biaya', this.form.ekstensi_biaya);
                this.transaksi.append('status_transaksi', this.form.status_transaksi);
                this.transaksi.append('status_verifikasi', this.form.status_verifikasi);
                this.transaksi.append('id_customer', this.form.id_customer);
                this.transaksi.append('id_driver', this.form.id_driver);
                this.transaksi.append('id_pegawai', this.form.id_pegawai);
                this.transaksi.append('id_aset', this.form.id_aset);
                this.transaksi.append('id_promo', this.form.id_promo);

                var url = this.$api + '/transaksi'
                this.load = true;
                this.$http.post(url, this.transaksi, {
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
                    no_ktp : this.form.no_ktp,
                    no_sim : this.form.no_sim,
                    tgl_transaksi : this.form.tgl_transaksi,
                    tgl_mulai_sewa : this.form.tgl_mulai_sewa,
                    tgl_selesai_sewa : this.form.tgl_selesai_sewa,
                    metode_pembayaran : this.form.metode_pembayaran,
                    total_biaya_sewa : this.form.total_biaya_sewa,
                    ekstensi_biaya : this.form.ekstensi_biaya,
                    status_transaksi : this.form.status_transaksi,
                    status_verifikasi : this.form.status_verifikasi,
                    id_customer : this.form.id_customer,
                    id_driver : this.form.id_driver,
                    id_pegawai : this.form.id_pegawai,
                    id_aset : this.form.id_aset,
                    id_promo : this.form.id_promo,
                };
                var url = this.$api + '/transaksi/' + this.editId;
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
                var url = this.$api + '/transaksi/' + this.deleteId;
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
                this.form.no_ktp = item.no_ktp;
                this.form.no_sim = item.no_sim;
                this.form.tgl_transaksi = item.tgl_transaksi;
                this.form.tgl_mulai_sewa = item.tgl_mulai_sewa;
                this.form.tgl_selesai_sewa = item.tgl_selesai_sewa;
                this.form.metode_pembayaran = item.metode_pembayaran;
                this.form.total_biaya_sewa = item.total_biaya_sewa;
                this.form.ekstensi_biaya = item.ekstensi_biaya;
                this.form.status_transaksi = item.status_transaksi;
                this.form.status_verifikasi = item.status_verifikasi;
                this.form.id_customer = item.id_customer;
                this.form.id_driver = item.id_driver;
                this.form.id_pegawai = item.id_pegawai;
                this.form.id_aset = item.id_aset;
                this.form.id_promo = item.id_promo;
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
                    no_ktp: null,
                    no_sim: null,
                    tgl_transaksi: null,
                    tgl_mulai_sewa: null,
                    tgl_selesai_sewa: null,
                    metode_pembayaran: null,
                    total_biaya_sewa: null,
                    ekstensi_biaya: null,
                    status_transaksi: null,
                    status_verifikasi: null,
                    id_customer: null,
                    id_driver: null,
                    id_pegawai: null,
                    id_aset: null,
                    id_promo: null,
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