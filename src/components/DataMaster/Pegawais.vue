<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Data Pegawai </h3>

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
            <v-data-table :headers="headers" :items="pegawais" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">ubah</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">hapus</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Pegawai </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_pegawai" label="Nama Pegawai" required></v-text-field>
                        <v-text-field v-model="form.alamat_pegawai" label="Alamat Pegawai" required></v-text-field>
                        <datepicker v-model="form.tgl_lahir_pegawai" class="mb-2" :max="max" size="sm" placeholder="Tgl Lahir Pegawai"></datepicker>
                        <p></p>
                        <v-select v-model="form.jenis_kelamin_pegawai" :items=itemsJenisKelamin label="Jenis Kelamin" required></v-select>
                        <v-text-field v-model="form.email_pegawai" label="Email Pegawai" required></v-text-field>
                        <v-text-field v-model="form.password_pegawai" label="Password Pegawai" required></v-text-field>
                        <v-text-field v-model="form.foto_pegawai" label="Foto Pegawai" required></v-text-field>
                        <v-text-field v-model="form.id_role" label="Id Role" required></v-text-field>
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
                <v-card-text>Anda Yakin ingin menghapus pegawai ini?</v-card-text>
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
                jenis_kelamin_pegawai: '',
                tgl_lahir_pegawai: new Date(),
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
                    { text: "Nama Pegawai", align: "start", sortable: true, value: "nama_pegawai"},
                    { text: "Alamat Pegawai", value: "alamat_pegawai"},
                    { text: "Tgl Lahir Pegawai", value: "tgl_lahir_pegawai"},
                    { text: "Jenis Kelamin", value: "jenis_kelamin_pegawai"},
                    { text: "Email Pegawai", value: "email_pegawai"},
                    { text: "Password Pegawai", value: "password_pegawai"},
                    { text: "Foto Pegawai", value: "foto_pegawai"},
                    { text: "Role", value: "id_role"},
                    { text: "*", value: "actions"},
                ],
                pegawai: new FormData,
                pegawais: [],
                form: {
                    nama_pegawai: null,
                    alamat_pegawai: null,
                    tgl_lahir_pegawai: null,
                    jenis_kelamin_pegawai: null,
                    email_pegawai: null,
                    password_pegawai: null,
                    foto_pegawai: null,
                    id_role: null,
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
                var url = this.$api + '/pegawai';
                this.$http.get(url, {
                    // headers: {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    // }
                }).then(response => {
                    this.pegawais = response.data.data;
                })
            },

            save(){
                this.pegawai.append('nama_pegawai', this.form.nama_pegawai);
                this.pegawai.append('alamat_pegawai', this.form.alamat_pegawai);
                this.pegawai.append('tgl_lahir_pegawai', this.form.tgl_lahir_pegawai);
                this.pegawai.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
                this.pegawai.append('email_pegawai', this.form.email_pegawai);
                this.pegawai.append('password_pegawai', this.form.password_pegawai);
                this.pegawai.append('foto_pegawai', this.form.foto_pegawai);
                this.pegawai.append('id_role', this.form.id_role);

                var url = this.$api + '/pegawai'
                this.load = true;
                this.$http.post(url, this.pegawai, {
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
                    nama_pegawai : this.form.nama_pegawai,
                    alamat_pegawai : this.form.alamat_pegawai,
                    tgl_lahir_pegawai : this.form.tgl_lahir_pegawai,
                    jenis_kelamin_pegawai : this.form.jenis_kelamin_pegawai,
                    email_pegawai : this.form.email_pegawai,
                    password_pegawai : this.form.password_pegawai,
                    foto_pegawai : this.form.foto_pegawai,
                    id_role : this.form.id_role,
                };
                var url = this.$api + '/pegawai/' + this.editId;
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
                var url = this.$api + '/pegawai/' + this.deleteId;
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
                this.form.nama_pegawai = item.nama_pegawai;
                this.form.alamat_pegawai = item.alamat_pegawai;
                this.form.tgl_lahir_pegawai = item.tgl_lahir_pegawai;
                this.form.jenis_kelamin_pegawai = item.jenis_kelamin_pegawai;
                this.form.email_pegawai = item.email_pegawai;
                this.form.password_pegawai = item.password_pegawai;
                this.form.foto_pegawai = item.foto_pegawai;
                this.form.id_role = item.id_role;
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
                    nama_pegawai: null,
                    alamat_pegawai: null,
                    tgl_lahir_pegawai: null,
                    jenis_kelamin_pegawai: null,
                    email_pegawai: null,
                    password_pegawai: null,
                    foto_pegawai: null,
                    id_role: null,
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