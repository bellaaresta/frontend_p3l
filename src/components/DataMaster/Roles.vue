<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Data Role </h3>

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
            <v-data-table :headers="headers" :items="roles" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">ubah</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">hapus</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Role </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select v-model="form.nama_role" :items=itemsRole label="Nama Role" required></v-select>
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
                <v-card-text>Anda Yakin ingin menghapus role ini?</v-card-text>
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
                nama_role: '',
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                itemsRole: [ "Manager", "Customer Service", "Admin" ],
                headers: [
                    { text: "Nama Role", align: "start", sortable: true, value: "nama_role"},
                    { text: "*", value: "actions"},
                ],
                role: new FormData,
                roles: [],
                form: {
                    nama_role: null,
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
                var url = this.$api + '/role';
                this.$http.get(url, {
                    // headers: {
                    //     'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    // }
                }).then(response => {
                    this.roles = response.data.data;
                })
            },

            save(){
                this.role.append('nama_role', this.form.nama_role);

                var url = this.$api + '/role'
                this.load = true;
                this.$http.post(url, this.role, {
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
                    nama_role : this.form.nama_role,
                };
                var url = this.$api + '/role/' + this.editId;
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
                var url = this.$api + '/role/' + this.deleteId;
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
                this.form.nama_role = item.nama_role;
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
                    nama_role: null,
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