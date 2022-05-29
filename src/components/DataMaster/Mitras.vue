<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Data Mitra </h3>

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
            <v-data-table :headers="headers" :items="mitras" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">ubah</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">hapus</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Mitra </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.no_ktp" label="No KTP" required></v-text-field>
                        <v-text-field v-model="form.nama_mitra" label="Nama Mitra" required></v-text-field>
                        <v-text-field v-model="form.alamat_mitra" label="Alamat Mitra" required></v-text-field>
                        <v-text-field v-model="form.notelp_mitra" label="No Telp Mitra" required></v-text-field>
                        <datepicker v-model="form.periode_mulai_kontrak" class="mb-2" :max="max" size="sm" placeholder="Periode Mulai Kontrak"></datepicker>
                        <p></p>
                        <datepicker v-model="form.periode_selesai_kontrak" class="mb-2" :max="max" size="sm" placeholder="Periode Selesai Kontrak"></datepicker>
                        <p></p>
                        <p></p>
                        <p></p>
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
                <v-card-text>Anda Yakin ingin menghapus mitra ini?</v-card-text>
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
                periode_mulai_kontrak: new Date(),
                periode_selesai_kontrak: new Date(),
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                headers: [
                    { text: "No KTP", align: "start", sortable: true, value: "no_ktp"},
                    { text: "Nama Mitra", value: "nama_mitra"},
                    { text: "Alamat Mitra", value: "alamat_mitra"},
                    { text: "No Telp Mitra", value: "notelp_mitra"},
                    { text: "Periode Mulai Kontrak", value: "periode_mulai_kontrak"},
                    { text: "Periode Selesai Kontrak", value: "periode_selesai_kontrak"},
                    { text: "*", value: "actions"},
                ],
                mitra: new FormData,
                mitras: [],
                form: {
                    no_ktp: null,
                    nama_mitra: null,
                    alamat_mitra: null,
                    notelp_mitra: null,
                    periode_mulai_kontrak: null,
                    periode_selesai_kontrak: null,
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
                var url = this.$api + '/mitra';
                this.$http.get(url, {
                    // headers: {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    // }
                }).then(response => {
                    this.mitras = response.data.data;
                })
            },

            save(){
                this.mitra.append('no_ktp', this.form.no_ktp);
                this.mitra.append('nama_mitra', this.form.nama_mitra);
                this.mitra.append('alamat_mitra', this.form.alamat_mitra);
                this.mitra.append('notelp_mitra', this.form.notelp_mitra);
                this.mitra.append('periode_mulai_kontrak', this.form.periode_mulai_kontrak);
                this.mitra.append('periode_selesai_kontrak', this.form.periode_selesai_kontrak);

                var url = this.$api + '/mitra'
                this.load = true;
                this.$http.post(url, this.mitra, {
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
                    nama_mitra : this.form.nama_mitra,
                    alamat_mitra : this.form.alamat_mitra,
                    notelp_mitra : this.form.notelp_mitra,
                    periode_mulai_kontrak : this.form.periode_mulai_kontrak,
                    periode_selesai_kontrak : this.form.periode_selesai_kontrak,
                };
                var url = this.$api + '/mitra/' + this.editId;
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
                var url = this.$api + '/mitra/' + this.deleteId;
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
                this.form.nama_mitra = item.nama_mitra;
                this.form.alamat_mitra = item.alamat_mitra;
                this.form.notelp_mitra = item.notelp_mitra;
                this.form.periode_mulai_kontrak = item.periode_mulai_kontrak;
                this.form.periode_selesai_kontrak = item.periode_selesai_kontrak;
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
                    nama_mitra: null,
                    alamat_mitra: null,
                    notelp_mitra: null,
                    periode_mulai_kontrak: null,
                    periode_selesai_kontrak: null,
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