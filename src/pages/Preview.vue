<script setup lang="ts">
import FormBansos from "../components/forms/FormBansos.vue";

const props = defineProps({
  formData: {}
})

const emits = defineEmits([
  'update:formData',
])

function isImage(file: File): boolean {
  return file.type.startsWith('image/');
}

function getFileURL(file: File): string {
  return URL.createObjectURL(file);
}

const data = props?.formData as typeof FormBansos
const file_ktp = data.file_ktp[0]
const file_kk = data.file_kk[0]

</script>

<template>
  <v-fade-transition class="mx-auto px-10 w-100 w-lg-50 w-md-66 w-sm-75">
    <v-sheet class="d-flex w-100 flex-column ga-5 py-5">
      <div class="d-flex flex-row align-center justify-space-between">
        <h1 class="font-weight-medium">Formulir penerima bantuan sosial LPM Jabar</h1>
        <img
            src="/logo_LPM.png"
            alt="logo" width="80">
      </div>
      <v-table hover class="border">
        <tbody>
        <tr>
          <th>Nama</th>
          <td>{{ data.name }}</td>
        </tr>
        <tr>
          <th>NIK</th>
          <td>{{ data.nik }}</td>
        </tr>
        <tr>
          <th>Nomor KK</th>
          <td>{{ data.nkk }}</td>
        </tr>
        <tr>
          <th>File KTP</th>
          <td>
            <img :src="getFileURL(file_ktp)" alt="Preview KTP" width="100" v-if="isImage(file_ktp)" />
            {{ data.file_ktp ? file_ktp.name : 'Belum diunggah' }}
          </td>
        </tr>
        <tr>
          <th>File KK</th>
          <td>
            <img :src="getFileURL(file_kk)" alt="Preview KK" width="100" v-if="isImage(file_kk)" />
            {{ data.file_kk ? file_kk.name : 'Belum diunggah' }}
          </td>
        </tr>
        <tr>
          <th>Umur</th>
          <td>{{ data.age }}</td>
        </tr>
        <tr>
          <th>Jenis Kelamin</th>
          <td>{{ data.gender === 'male' ? 'Laki-laki' : 'Perempuan' }}</td>
        </tr>
        <tr>
          <th>Provinsi</th>
          <td>{{ data.province }}</td>
        </tr>
        <tr>
          <th>Kabupaten/Kota</th>
          <td>{{ data.regency }}</td>
        </tr>
        <tr>
          <th>Kecamatan</th>
          <td>{{ data.district }}</td>
        </tr>
        <tr>
          <th>Kelurahan/Desa</th>
          <td>{{ data.sub_district }}</td>
        </tr>
        <tr>
          <th>Alamat</th>
          <td>{{ data.address }}</td>
        </tr>
        <tr>
          <th>RT</th>
          <td>{{ data.rt }}</td>
        </tr>
        <tr>
          <th>RW</th>
          <td>{{ data.rw }}</td>
        </tr>
        <tr>
          <th>Pendapatan Sebelum Pandemi</th>
          <td>{{
              data.income_before_pandemic ? data.income_before_pandemic.toLocaleString() : 'Tidak tersedia'
            }}
          </td>
        </tr>
        <tr>
          <th>Pendapatan Setelah Pandemi</th>
          <td>{{
              data.income_after_pandemic ? data.income_after_pandemic.toLocaleString() : 'Tidak tersedia'
            }}
          </td>
        </tr>
        <tr>
          <th>Alasan Mengajukan</th>
          <td>{{ data.reason_for_apply }}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <td colspan="2">
            <v-btn class="w-100" variant="tonal"
                   prepend-icon="mdi-arrow-left"
                   @click="emits('update:formData', null)"
            >
              Kembali ke form
            </v-btn>
          </td>
        </tr>
        </tfoot>
      </v-table>
    </v-sheet>
  </v-fade-transition>
</template>

<style scoped>

</style>