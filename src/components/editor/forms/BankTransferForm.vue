<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { BankTransferConfig } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()

const BANKS = [
  { id: 'VCB',    name: 'Vietcombank' },
  { id: 'TCB',    name: 'Techcombank' },
  { id: 'MB',     name: 'MB Bank' },
  { id: 'BIDV',   name: 'BIDV' },
  { id: 'VTB',    name: 'VietinBank' },
  { id: 'ACB',    name: 'ACB' },
  { id: 'TPB',    name: 'TPBank' },
  { id: 'VPB',    name: 'VPBank' },
  { id: 'AGRB',   name: 'Agribank' },
  { id: 'SHB',    name: 'SHBank' },
  { id: 'MSB',    name: 'MSB' },
  { id: 'OCB',    name: 'OCB' },
  { id: 'MBB',    name: 'MBBank' },
  { id: 'HDB',    name: 'HDBank' },
  { id: 'SEAB',   name: 'SeABank' },
]

const form = ref<BankTransferConfig>({
  title: '',
  bank_id: 'VCB',
  account_number: '',
  account_name: '',
  amount: undefined,
  transfer_message: '',
  note: 'Sự hiện diện của bạn là món quà quý nhất với chúng tôi',
  ...(props.config as unknown as BankTransferConfig),
})

watch(() => props.config, (newCfg) => {
  form.value = { ...form.value, ...(newCfg as unknown as BankTransferConfig) }
}, { deep: true })

function update() {
  editorStore.updateSectionConfig(props.sectionType, form.value as unknown as Record<string, unknown>)
}

function onAccountNameInput(val: string) {
  form.value.account_name = val.toUpperCase()
  update()
}
</script>

<template>
  <div class="space-y-4">

    <AppInput
      label="Tiêu đề"
      :model-value="form.title ?? ''"
      placeholder="Mừng cưới"
      @update:model-value="form.title = $event; update()"
    />

    <!-- Bank select -->
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Ngân hàng</label>
      <select
        :value="form.bank_id"
        class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        @change="form.bank_id = ($event.target as HTMLSelectElement).value; update()"
      >
        <option v-for="bank in BANKS" :key="bank.id" :value="bank.id">
          {{ bank.id }} — {{ bank.name }}
        </option>
      </select>
    </div>

    <AppInput
      label="Số tài khoản"
      :model-value="form.account_number"
      placeholder="1234567890"
      @update:model-value="form.account_number = $event; update()"
    />

    <AppInput
      label="Tên chủ tài khoản"
      :model-value="form.account_name"
      placeholder="NGUYEN VAN A"
      @update:model-value="onAccountNameInput($event)"
    />

    <AppInput
      label="Số tiền gợi ý (VNĐ)"
      type="number"
      :model-value="form.amount !== undefined ? String(form.amount) : ''"
      placeholder="200000"
      @update:model-value="form.amount = $event ? Number($event) : undefined; update()"
    />

    <AppInput
      label="Nội dung chuyển khoản"
      :model-value="form.transfer_message ?? ''"
      placeholder="Mung cuoi Nam va Linh"
      @update:model-value="form.transfer_message = $event; update()"
    />

    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Lời nhắn</label>
      <textarea
        :value="form.note ?? ''"
        rows="2"
        class="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        placeholder="Sự hiện diện của bạn là món quà quý nhất"
        @input="form.note = ($event.target as HTMLTextAreaElement).value; update()"
      />
    </div>

    <!-- QR Preview -->
    <div v-if="form.account_number" class="rounded-xl bg-gray-50 p-3 text-center">
      <p class="mb-2 text-xs text-gray-500">Xem trước QR VietQR</p>
      <img
        :src="`https://img.vietqr.io/image/${form.bank_id}-${form.account_number}-compact2.png${form.amount ? `?amount=${form.amount}` : ''}`"
        alt="QR preview"
        class="mx-auto max-w-[160px] rounded-lg"
        loading="lazy"
      />
    </div>
  </div>
</template>
