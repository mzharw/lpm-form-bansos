<script lang="ts">

import SelectRegion from "./inputs/SelectRegion.vue"
import CurrencyInput from "./inputs/CurrencyInput.vue"
import {VNumberInput} from "vuetify/labs/components"
import {NotificationOptions} from "../providers/NotificationProvider"
import {getRandomInt} from "../../utils/number"

interface FormBansos {
  name: string,
  nik: string,
  nkk: string,
  file_ktp: File | undefined,
  file_kk: File | undefined,
  age: string,
  gender: 'male' | 'female' | undefined,
  province: string,
  regency: string,
  district: string,
  sub_district: string,
  address: string,
  rt: string,
  rw: string,
  income_before_pandemic: number | undefined,
  income_after_pandemic: number | undefined,
  reason_for_apply: 'Kehilangan pekerjaan' | 'Kepala keluarga' | 'Tergolong fakir/miskin' | string,
}

interface Data {
  valid: boolean
  tnc: boolean
  loading: boolean
  formData: FormBansos
  rules: any
  region_ids: any
}

export default {
  components: {CurrencyInput, SelectRegion, VNumberInput},
  emits: ['update:formData'],
  data: (): Data => ({
        valid: false,
        tnc: false,
        loading: false,
        formData: {
          name: '',
          nik: '',
          nkk: '',
          file_ktp: undefined,
          file_kk: undefined,
          age: '',
          gender: undefined,
          province: '',
          regency: '',
          district: '',
          sub_district: '',
          address: '',
          rt: '',
          rw: '',
          income_before_pandemic: 0,
          income_after_pandemic: 0,
          reason_for_apply: '',
        },
        region_ids: {
          province_id: '',
          district_id: '',
          regency_id: '',
          sub_district_id: '',
        },
        rules: {
          name: [
            (v: string | null) => !!v || 'Nama wajib diisi',
          ],
          nik: [
            (v: string | null) => !!v || 'NIK wajib diisi',
            (v: string | null) => (v && v.length === 16) || 'NIK harus terdiri dari 16 karakter',
          ],
          nkk: [
            (v: string | null) => !!v || 'Nomor KK wajib diisi',
            (v: string | null) => (v && v.length === 16) || 'Nomor KK  harus terdiri dari 16 karakter',
          ],
          age: [
            (v: string | null) => !!v || 'Umur wajib diisi',
            (v: string | null) => (v && v.length <= 3) || 'Umur harus terdiri dari 3 karakter atau kurang',
          ],
          gender: [
            (v: string | null) => !!v || 'Jenis kelamin wajib diisi',
          ],
          file_ktp: [
            (files: Array<File>) => !!files.length || 'Berkas wajib diisi',
            (files: Array<File>) => !files || !files.some(file => file.size > 2_097_152) || 'Ukuran berkas harus kurang dari 2 MB',
          ],
          file_kk: [
            (files: Array<File>) => !!files.length || 'Berkas wajib diisi',
            (files: Array<File>) => !files || !files.some(file => file.size > 2_097_152) || 'Ukuran berkas harus kurang dari 2 MB'
          ],
          province: [(v: string | null) => !!v || 'Provinsi wajib diisi'],
          regency: [(v: string | null) => !!v || 'Kabupaten/kota wajib diisi'],
          district: [(v: string | null) => !!v || 'Kecamatan wajib diisi'],
          sub_district: [(v: string | null) => !!v || 'Kelurahan wajib diisi'],
          rt: [
            (v: string | null) => !!v || 'RT wajib diisi',
            (v: string | null) => (v && v.length <= 3) || 'RT maksimal 3 karakter',
          ],
          rw: [
            (v: string | null) => !!v || 'RW wajib diisi',
            (v: string | null) => (v && v.length <= 3) || 'RW maksimal 3 karakter',
          ],
          income_before_pandemic: [
            (v: string | null) => !!v || 'Pendapatan sebelum pandemi wajib diisi',
            (v: string | null) => (v && parseFloat(v) >= 0) || 'Pendapatan tidak boleh kurang dari 0',
          ],
          income_after_pandemic: [
            (v: string | null) => !!v || 'Pendapatan setelah pandemi wajib diisi',
            (v: string | null) => (v && parseFloat(v) >= 0) || 'Pendapatan tidak boleh kurang dari 0',
          ],
          address: [(v: string | null) => !!v || 'Alamat wajib diisi'],
          reason_for_apply: [(v: string | null) => !!v || 'Alasan membutuhkan bantuan wajib diisi'],
        },
      }
  ),
  computed: {
    showRegency() {
      return this.region_ids.province_id !== '' && this.region_ids.province_id !== undefined && this.region_ids.province_id !== null
    },
    showDistrict() {
      return this.region_ids.regency_id !== '' && this.region_ids.regency_id !== undefined && this.region_ids.regency_id !== null
    },
    showSubDistrict() {
      return this.region_ids.district_id !== '' && this.region_ids.district_id !== undefined && this.region_ids.district_id !== null
    }
  }
  ,
  watch: {
    'formData.province'() {
      this.resetRegency()
      this.resetDistrict()
      this.resetSubDistrict()
    },
    'formData.regency'() {
      this.resetDistrict()
      this.resetSubDistrict()
    },
    'formData.district'() {
      this.resetSubDistrict()
    },
    'region_ids.province_id'(newVal) {
      if (!newVal) {
        this.resetRegency()
        this.resetDistrict()
        this.resetSubDistrict()
      }
    },
    'region_ids.regency_id'(newVal) {
      if (!newVal) {
        this.resetDistrict()
        this.resetSubDistrict()
      }
    },
    'region_ids.district_id'(newVal) {
      if (!newVal) {
        this.resetSubDistrict()
      }
    },
  }
  ,
  methods: {
    resetRegency() {
      this.formData.regency = ''
      this.region_ids.regency_id = ''
    },
    resetDistrict() {
      this.formData.district = ''
      this.region_ids.district_id = ''
    },
    resetSubDistrict() {
      this.formData.sub_district = ''
      this.region_ids.sub_district_id = ''
    },
    onSubmit() {
      this.loading = true
      const form = this.$refs.form as { isValid: boolean }

      if (form.isValid) {
        setTimeout(() => {
          let options: NotificationOptions
          if (getRandomInt(2)) {
            options = {
              title: 'Berhasil',
              desc: 'Berhasil menyimpan formulir!',
              context: 'success',
              icon: 'mdi-check-circle',
              timeout: 3000
            }

            this.$emit('update:formData', this.formData);
          } else {
            options = {
              title: 'Interval Server Error',
              desc: 'Gagal menyimpan formulir',
              context: 'error',
              icon: 'mdi-check-circle',
              timeout: 3000
            }
          }
          this.loading = false
          this.$root?.notify(options)
        }, 1500)
      } else {
        const options: NotificationOptions = {
          title: 'Formulir belum lengkap',
          desc: 'Mohon periksa kembali formulir yang diisi',
          context: 'error',
          icon: 'mdi-alert-circle',
          timeout: 3000
        }

        this.$root?.notify(options)
        this.loading = false
      }
    }
  }
}

</script>

<template>
  <v-sheet class="mx-auto px-10 w-100 w-lg-50 w-md-66 w-sm-75">
    <v-form ref="form" class="d-flex w-100 flex-column ga-5 py-5" @submit.prevent="onSubmit">
      <div class="d-flex flex-row align-center justify-space-between">
        <h1 class="font-weight-medium">Formulir penerima bantuan sosial LPM Jabar</h1>
        <img
            src="http://cigombong-cigombong.desa.id/assets/files/data/website-desa-cigombong-3201382001/images/logo_LPM.png"
            alt="logo" width="80">
      </div>
      <v-divider></v-divider>
      <h4>Data diri</h4>
      <v-text-field
          v-model="formData.name"
          :rules="rules.name"
          variant="outlined"
          density="comfortable"
          required
      >
        <template #label>
          Nama <span class="text-red"><strong>*</strong></span>
        </template>
      </v-text-field>
      <v-text-field
          counter="16"
          v-model="formData.nik"
          :rules="rules.nik"
          variant="outlined"
          density="comfortable"
          type="number"
          required
      >
        <template #label>
          NIK <span class="text-red"><strong>*</strong></span>
        </template>
      </v-text-field>
      <v-text-field
          counter="16"
          v-model="formData.nkk"
          :rules="rules.nkk"
          variant="outlined"
          density="comfortable"
          type="number"
          required
      >
        <template #label>
          Nomor KK <span class="text-red"><strong>*</strong></span>
        </template>
      </v-text-field>
      <v-file-input
          v-model="formData.file_ktp"
          :rules="rules.file_ktp"
          counter
          multiple
          show-size
          variant="outlined"
          density="comfortable"
          accept="image/png, image/gif, image/jpeg, image/bmp"
      >
        <template #label>
          Foto KTP <span class="text-red"><strong>*</strong></span>
        </template>
      </v-file-input>
      <v-file-input
          v-model="formData.file_kk"
          :rules="rules.file_kk"
          counter
          multiple
          show-size
          variant="outlined"
          density="comfortable"
          accept="image/png, image/gif, image/jpeg, image/bmp"
      >
        <template #label>
          Foto KK <span class="text-red"><strong>*</strong></span>
        </template>
      </v-file-input>
      <v-text-field
          counter="3"
          v-model="formData.age"
          :rules="rules.age"
          variant="outlined"
          density="comfortable"
          type="number"
          required
      >
        <template #label>
          Umur <span class="text-red"><strong>*</strong></span>
        </template>
      </v-text-field>
      <!--      <v-radio-group inline v-model="formData.gender" :rules="rules.gender">-->
      <!--        <template #label>-->
      <!--          Jenis Kelamin <span class="text-red"><strong> *</strong></span>-->
      <!--        </template>-->
      <!--        <v-radio label="Laki-laki" value="male"></v-radio>-->
      <!--        <v-radio label="Perempuan" value="female"></v-radio>-->
      <!--      </v-radio-group>-->
      <v-select
          v-model="formData.gender"
          variant="outlined"
          density="comfortable"
          :rules="rules.gender"
          :items="[{title: 'Laki-laki', value: 'male'}, {title: 'Perempuan', value: 'female'}]"
      >
        <template #label>
          Jenis Kelamin <span class="text-red"><strong> *</strong></span>
        </template>
      </v-select>


      <v-divider class="mb-5"></v-divider>


      <SelectRegion
          division="province"
          v-model="formData.province"
          :rules="rules.province"
          variant="outlined"
          density="comfortable"
          @update:refId="val => region_ids.province_id = val"
      >
        <template #label>
          Pilih provinsi <span class="text-red"><strong>*</strong></span>
        </template>
      </SelectRegion>
      <SelectRegion
          v-if="showRegency"
          division="regency"
          v-model="formData.regency"
          :refId="region_ids.province_id"
          :rules="rules.regency"
          label="Pilih kabupaten/kota"
          variant="outlined"
          density="comfortable"
          @update:refId="val => region_ids.regency_id = val"
      >
        <template #label>
          Pilih kabupaten/kota <span class="text-red"><strong>*</strong></span>
        </template>
      </SelectRegion>
      <SelectRegion
          v-if="showDistrict"
          division="district"
          v-model="formData.district"
          :refId="region_ids.regency_id"
          :rules="rules.district"
          label="Pilih kecamatan"
          variant="outlined"
          density="comfortable"
          @update:refId="val => region_ids.district_id = val"
      >
        <template #label>
          Pilih kecamatan <span class="text-red"><strong>*</strong></span>
        </template>
      </SelectRegion>
      <SelectRegion
          v-if="showSubDistrict"
          division="sub_district"
          v-model="formData.sub_district"
          :refId="region_ids.district_id"
          :rules="rules.sub_district"
          label="Pilih kelurahan"
          variant="outlined"
          density="comfortable"
          @update:refId="val => region_ids.sub_district_id = val"
      >
        <template #label>
          Pilih kelurahan <span class="text-red"><strong>*</strong></span>
        </template>
      </SelectRegion>
      <v-sheet class="d-flex ga-3">
        <v-text-field
            counter="3"
            v-model="formData.rt"
            :rules="rules.rt"
            variant="outlined"
            density="comfortable"
            type="number"
            required
        >
          <template #label>
            RT <span class="text-red"><strong>*</strong></span>
          </template>
        </v-text-field>
        <v-text-field
            counter="3"
            v-model="formData.rw"
            :rules="rules.rw"
            variant="outlined"
            density="comfortable"
            type="number"
            required
        >
          <template #label>
            RW <span class="text-red"><strong>*</strong></span>
          </template>
        </v-text-field>
      </v-sheet>
      <v-textarea
          v-model="formData.address"
          :rules="rules.address"
          variant="outlined"
          density="comfortable"
          required
      >
        <template #label>
          Alamat <span class="text-red"><strong>*</strong></span>
        </template>
      </v-textarea>

      <v-divider></v-divider>

      <h4>Pendapatan <span class="text-red"><strong>*</strong></span></h4>
      <v-sheet class="d-flex ga-3">
        <CurrencyInput
            v-model="formData.income_before_pandemic"
            variant="outlined"
            density="comfortable"
            :options="{ currency: 'IDR' }"
            :rules="rules.income_before_pandemic"
            label="Sebelum pandemi"
        />
        <CurrencyInput
            v-model="formData.income_after_pandemic"
            variant="outlined"
            density="comfortable"
            :options="{ currency: 'IDR' }"
            :rules="rules.income_after_pandemic"
            label="Setelah pandemi"
        />
      </v-sheet>
      <v-combobox
          v-model="formData.reason_for_apply"
          variant="outlined"
          density="comfortable"
          messages="Anda dapat mengetik manual untuk alasan lainnya"
          :rules="rules.reason_for_apply"
          :items="['Kehilangan pekerjaan', 'Kepala keluarga', 'Tergolong fakir/miskin']"
      >
        <template #label>
          Alasan membutuhkan uang <span class="text-red"><strong> *</strong></span>
        </template>
      </v-combobox>

      <v-divider></v-divider>

      <v-checkbox
          v-model="tnc"
          :rules="[v => !!v || 'Anda harus mencentang kolom diatas untuk melanjutkan']"
          label="Saya menyatakan bahwa data yang diisikan adalah benar dan siap mempertanggungjawabkan apabila ditemukan ketidaksesuaian dalam data tersebut?"
          required
      ></v-checkbox>
      <v-btn variant="tonal" type="submit" color="primary" :loading="loading">
        Submit
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<style scoped>

</style>