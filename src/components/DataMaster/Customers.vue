<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Data Customer </h3>

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
            <v-data-table :headers="headers" :items="customers" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">ubah</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">hapus</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Customer </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_lengkap" label="Nama Lengkap Customer" required></v-text-field>
                        <datepicker v-model="form.tanggal_lahir" class="mb-2" :max="max" size="sm" placeholder="Tgl Lahir Customer"></datepicker>
                        <p></p>
                        <v-select v-model="form.jenis_kelamin" :items=itemsJenisKelamin label="Jenis Kelamin Customer" required></v-select>
                        <v-text-field v-model="form.email" label="Email Customer" required></v-text-field>
                        <v-text-field v-model="form.password" label="Password Customer" required></v-text-field>
                        <v-text-field v-model="form.no_telp" label="Notelp Customer" required></v-text-field>
                        <v-text-field v-model="form.alamat" label="Alamat Customer" required></v-text-field>
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
                <v-card-text>Anda Yakin ingin menghapus customer ini?</v-card-text>
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
                jenis_kelamin: '',
                tgl_lahir: new Date(),
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                itemsJenisKelamin: [ "Laki-laki" , "Perempuan" ],
                headers: [
                    { text: "Nama Lengkap", align: "start", sortable: true, value: "nama_lengkap"},
                    { text: "Tgl Lahir", value: "tanggal_lahir"},
                    { text: "Jenis Kelamin", value: "jenis_kelamin"},
                    { text: "Email", value: "email"},
                    { text: "Password", value: "password"},
                    { text: "Notelp", value: "no_telp"},
                    { text: "Alamat", value: "alamat"},
                    { text: "*", value: "actions"},
                ],
                customer: new FormData,
                customers: [],
                form: {
                    nama_lengkap: null,
                    tanggal_lahir: null,
                    jenis_kelamin: null,
                    email: null,
                    password: null,
                    no_telp: null,
                    alamat: null,
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
                var url = this.$api + '/customer';
                this.$http.get(url, {
                    // headers: {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    // }
                }).then(response => {
                    this.customers = response.data.data;
                })
            },

            save(){
                this.customer.append('nama_lengkap', this.form.nama_lengkap);
                this.customer.append('tanggal_lahir', this.form.tanggal_lahir);
                this.customer.append('jenis_kelamin', this.form.jenis_kelamin);
                this.customer.append('email', this.form.email);
                this.customer.append('password', this.form.password);
                this.customer.append('no_telp', this.form.no_telp);
                this.customer.append('alamat', this.form.alamat);

                var url = this.$api + '/customer'
                this.load = true;
                this.$http.post(url, this.customer, {
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
                    nama_lengkap : this.form.nama_lengkap,
                    tanggal_lahir : this.form.tanggal_lahir,
                    jenis_kelamin : this.form.jenis_kelamin,
                    email : this.form.email,
                    password : this.form.password,
                    no_telp : this.form.no_telp,
                    alamat : this.form.alamat,
                };
                var url = this.$api + '/customer/' + this.editId;
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
                var url = this.$api + '/customer/' + this.deleteId;
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
                this.form.nama_lengkap = item.nama_lengkap;
                this.form.tanggal_lahir = item.tanggal_lahir;
                this.form.jenis_kelamin = item.jenis_kelamin;
                this.form.email = item.email;
                this.form.password = item.password;
                this.form.no_telp = item.no_telp;
                this.form.alamat = item.alamat;
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
                    nama_lengkap: null,
                    tanggal_lahir: null,
                    jenis_kelamin: null,
                    email: null,
                    password: null,
                    no_telp: null,
                    alamat: null,
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