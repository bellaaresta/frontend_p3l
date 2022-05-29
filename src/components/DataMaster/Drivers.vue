<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Data Driver </h3>

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
            <v-data-table :headers="headers" :items="drivers" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">ubah</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">hapus</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Driver </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_driver" label="Nama Driver" required></v-text-field>
                        <v-text-field v-model="form.alamat_driver" label="Alamat Driver" required></v-text-field>
                        <datepicker v-model="form.tgl_lahir_driver" class="mb-2" :max="max" size="sm" placeholder="Tgl Lahir Driver"></datepicker>
                        <p></p>
                        <v-select v-model="form.jenis_kelamin_driver" :items=itemsJenisKelamin label="Jenis Kelamin" required></v-select>
                        <v-text-field v-model="form.notelp_driver" label="No Telp Driver" required></v-text-field>
                        <v-text-field v-model="form.email_driver" label="Email Driver" required></v-text-field>
                        <v-text-field v-model="form.password_driver" label="Password Driver" required></v-text-field>
                        <v-select v-model="form.status_tersedia" :items=itemsStatusTersedia label="Status Tersedia" required></v-select>
                        <v-text-field v-model="form.berkas_driver" label="Berkas Driver" required></v-text-field>
                        <v-text-field v-model="form.bahasa" label="Bahasa" required></v-text-field>
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
                <v-card-text>Anda Yakin ingin menghapus driver ini?</v-card-text>
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
                jenis_kelamin_driver: '',
                status_tersedia: '',
                tgl_lahir_driver: new Date(),
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                itemsJenisKelamin: [ "Laki-laki" , "Perempuan" ],
                itemsStatusTersedia : ["Tersedia", "Tidak Tersedia"],
                headers: [
                    { text: "Nama Driver", align: "start", sortable: true, value: "nama_driver"},
                    { text: "Alamat Driver", value: "alamat_driver"},
                    { text: "Tgl Lahir Driver", value: "tgl_lahir_driver"},
                    { text: "Jenis Kelamin", value: "jenis_kelamin_driver"},
                    { text: "No Telp Driver", value: "notelp_driver"},
                    { text: "Email Driver", value: "email_driver"},
                    { text: "Password", value: "password_driver"},
                    { text: "Status Tersedia", value: "status_tersedia"},
                    { text: "Berkas Driver", value: "berkas_driver"},
                    { text: "Bahasa", value: "bahasa"},
                    { text: "*", value: "actions"},
                ],
                driver: new FormData,
                drivers: [],
                form: {
                    nama_driver: null,
                    alamat_driver: null,
                    tgl_lahir_driver: null,
                    jenis_kelamin_driver: null,
                    notelp_driver: null,
                    email_driver: null,
                    password_driver: null,
                    status_tersedia: null,
                    berkas_driver: null,
                    bahasa: null,
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
                var url = this.$api + '/driver';
                this.$http.get(url, {
                    // headers: {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    // }
                }).then(response => {
                    this.drivers = response.data.data;
                })
            },

            save(){
                this.driver.append('nama_driver', this.form.nama_driver);
                this.driver.append('alamat_driver', this.form.alamat_driver);
                this.driver.append('tgl_lahir_driver', this.form.tgl_lahir_driver);
                this.driver.append('jenis_kelamin_driver', this.form.jenis_kelamin_driver);
                this.driver.append('notelp_driver', this.form.notelp_driver);
                this.driver.append('email_driver', this.form.email_driver);
                this.driver.append('password_driver', this.form.password_driver);
                this.driver.append('status_tersedia', this.form.status_tersedia);
                this.driver.append('berkas_driver', this.form.berkas_driver);
                this.driver.append('bahasa', this.form.bahasa);

                var url = this.$api + '/driver'
                this.load = true;
                this.$http.post(url, this.driver, {
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
                    nama_driver : this.form.nama_driver,
                    alamat_driver : this.form.alamat_driver,
                    tgl_lahir_driver : this.form.tgl_lahir_driver,
                    jenis_kelamin_driver : this.form.jenis_kelamin_driver,
                    notelp_driver : this.form.notelp_driver,
                    email_driver : this.form.email_driver,
                    password_driver : this.form.password_driver,
                    status_tersedia : this.form.status_tersedia,
                    berkas_driver : this.form.berkas_driver,
                    bahasa : this.form.bahasa,
                };
                var url = this.$api + '/driver/' + this.editId;
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
                var url = this.$api + '/driver/' + this.deleteId;
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
                this.form.nama_driver = item.nama_driver;
                this.form.alamat_driver = item.alamat_driver;
                this.form.tgl_lahir_driver = item.tgl_lahir_driver;
                this.form.jenis_kelamin_driver = item.jenis_kelamin_driver;
                this.form.notelp_driver = item.notelp_driver;
                this.form.email_driver = item.email_driver;
                this.form.password_driver = item.password_driver;
                this.form.status_tersedia = item.status_tersedia;
                this.form.berkas_driver = item.berkas_driver;
                this.form.bahasa = item.bahasa;
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
                    nama_driver: null,
                    alamat_driver: null,
                    tgl_lahir_driver: null,
                    jenis_kelamin_driver: null,
                    notelp_driver: null,
                    email_driver: null,
                    password_driver: null,
                    status_tersedia: null,
                    berkas_driver: null,
                    bahasa: null,
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