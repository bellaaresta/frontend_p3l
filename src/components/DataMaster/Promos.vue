<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Data Promo </h3>

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
            <v-data-table :headers="headers" :items="promos" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">ubah</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">hapus</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Promo </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.kode_promo" label="Kode Promo" required></v-text-field>
                        <v-text-field v-model="form.jenis_promo" label="Jenis Promo" required></v-text-field>
                        <v-text-field v-model="form.diskon_promo" label="Diskon Promo" required></v-text-field>
                        <v-text-field v-model="form.keterangan" label="Keterangan" required></v-text-field>
                        <v-select v-model="form.status_promo" :items=itemsStatusPromo label="Status Promo" required></v-select>
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
                <v-card-text>Anda Yakin ingin menghapus promo ini?</v-card-text>
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
                status_promo: '',
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                itemsStatusPromo: [ "Aktif" , "Tidak Aktif" ],
                headers: [
                    { text: "Kode Promo", align: "start", sortable: true, value: "kode_promo"},
                    { text: "Jenis Promo", value: "jenis_promo"},
                    { text: "Diskon Promo", value: "diskon_promo"},
                    { text: "Keterangan", value: "keterangan"},
                    { text: "Status Promo", value: "status_promo"},
                    { text: "*", value: "actions"},
                ],
                promo: new FormData,
                promos: [],
                form: {
                    kode_promo: null,
                    jenis_promo: null,
                    diskon_promo: null,
                    keterangan: null,
                    status_promo: null,
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
                var url = this.$api + '/promo';
                this.$http.get(url, {
                    // headers: {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    // }
                }).then(response => {
                    this.promos = response.data.data;
                })
            },

            save(){
                this.promo.append('kode_promo', this.form.kode_promo);
                this.promo.append('jenis_promo', this.form.jenis_promo);
                this.promo.append('diskon_promo', this.form.diskon_promo);
                this.promo.append('keterangan', this.form.keterangan);
                this.promo.append('status_promo', this.form.status_promo);

                var url = this.$api + '/promo'
                this.load = true;
                this.$http.post(url, this.promo, {
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
                    kode_promo : this.form.kode_promo,
                    jenis_promo : this.form.jenis_promo,
                    diskon_promo : this.form.diskon_promo,
                    keterangan : this.form.keterangan,
                    status_promo : this.form.status_promo,
                };
                var url = this.$api + '/promo/' + this.editId;
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
                var url = this.$api + '/promo/' + this.deleteId;
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
                this.form.kode_promo = item.kode_promo;
                this.form.jenis_promo = item.jenis_promo;
                this.form.diskon_promo = item.diskon_promo;
                this.form.keterangan = item.keterangan;
                this.form.status_promo = item.status_promo;
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
                    kode_promo: null,
                    jenis_promo: null,
                    diskon_promo: null,
                    keterangan: null,
                    status_promo: null,
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