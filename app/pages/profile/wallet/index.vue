<template>
    <div class="wallet-page">
        <!-- List Section -->
        <div class="list-section">
            <div
                    v-for="card in bankCards"
                    :key="card.id"
                    class="card-item"
                    @click="editCard(card)"
            >
                <div class="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/>
                        <path d="M2 10h20" stroke="currentColor" stroke-width="1.8"/>
                    </svg>
                </div>
                <div class="card-info">
                    <div class="bank-name">{{ card.bankName }}</div>
                    <div class="card-number">**** **** **** {{ card.lastFour }}</div>
                </div>
                <div class="card-action">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Bottom Button -->
        <div class="bottom-bar">
            <button class="add-btn" @click="addCard">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                </svg>
                添加银行卡
            </button>
        </div>

        <!-- Wallet Modal -->
        <WalletModal 
            v-model="showWalletModal" 
            :initialData="currentCard" 
            @submit="saveCard" 
        />
    </div>
</template>

<script setup>
    import {ref} from 'vue'
    import WalletModal from '../components/WalletModal.vue'

definePageMeta({ layout: 'second-page' })

    // Modal State
    const showWalletModal = ref(false)
    const currentCard = ref(null)
    const isEditing = ref(false)

    // Mock data
    const bankCards = ref([
        {
            id: 1,
            bankName: 'Banco do Brasil',
            lastFour: '1234',
            name: 'John Doe',
            phone: '11 99999-0001',
            bank: 'bank1',
            cardNumber: '1234567890123456'
        },
        {
            id: 2,
            bankName: 'Itaú',
            lastFour: '5678',
            name: 'John Doe',
            phone: '11 99999-0001',
            bank: 'bank3',
            cardNumber: '9876543210987654'
        },
    ])

    const editCard = (card) => {
        currentCard.value = card
        isEditing.value = true
        showWalletModal.value = true
    }

    const addCard = () => {
        currentCard.value = null
        isEditing.value = false
        showWalletModal.value = true
    }

    const saveCard = (formData) => {
        if (isEditing.value && currentCard.value) {
            // Update existing card
            const index = bankCards.value.findIndex(c => c.id === currentCard.value.id)
            if (index !== -1) {
                bankCards.value[index] = {
                    ...currentCard.value,
                    ...formData,
                    bankName: getBankName(formData.bank),
                    lastFour: formData.cardNumber.slice(-4)
                }
            }
            alert('银行卡修改成功')
        } else {
            // Add new card
            const newCard = {
                id: Date.now(),
                ...formData,
                bankName: getBankName(formData.bank),
                lastFour: formData.cardNumber.slice(-4)
            }
            bankCards.value.push(newCard)
            alert('银行卡添加成功')
        }
        showWalletModal.value = false
    }

    const getBankName = (bankCode) => {
        const bankMap = {
            'bank1': 'Banco do Brasil',
            'bank2': 'Caixa Econômica',
            'bank3': 'Itaú',
            'bank4': 'Bradesco',
            'bank5': 'Santander'
        }
        return bankMap[bankCode] || bankCode
    }
</script>

<style scoped lang="scss">
    .wallet-page {
        min-height: 100vh;
        background: $color-bg-page;
        padding-bottom: rem(120);
    }

    // List Section
    .list-section {
        margin: rem(12) rem(16);
    }

    .card-item {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: $radius-lg;
        padding: rem(16);
        margin-bottom: rem(10);
        box-shadow: $shadow-sm;
        cursor: pointer;
        transition: transform 0.2s;

        &:active {
            transform: scale(0.98);
        }
    }

    .card-icon {
        width: rem(40);
        height: rem(40);
        border-radius: $radius-md;
        background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: rem(12);
        color: $color-text-secondary;

        svg {
            width: rem(20);
            height: rem(20);
        }
    }

    .card-info {
        flex: 1;
        min-width: 0;
    }

    .bank-name {
        font-size: rem(15);
        font-weight: 600;
        color: $color-text-primary;
        margin-bottom: rem(4);
    }

    .card-number {
        font-size: rem(14);
        color: $color-text-secondary;
    }

    .card-action {
        padding: rem(8);
        color: $color-text-muted;

        svg {
            width: rem(20);
            height: rem(20);
        }
    }
</style>
