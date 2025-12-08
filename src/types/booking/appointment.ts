export type Service = {
    _id: string
    name: string
    price: number
    code: string
}

export type ExtraService = {
    id: string
    name: string
    price: number
    code: string
}

export type TeamMember = {
    id: string
    workerId: string
    firstName: string
    lastName: string
    name: string
    city: string
    state: string
    location: string
    phone: string
    email: string
    price: string
    image: string
    services: Service[]
    extraServices: ExtraService[]
}

export type BookingItem = {
    _id?:string
    date: string
    time: string
    service: Service
    addOns: ExtraService[]
}

export type SelectedSlot = {
    time: string
    service: Service
    addOns: ExtraService[]
}


export type BookingCartProps = {
    bookings: BookingItem[]
    memberName: string
    workerId: string
    onCheckout: () => void
}


type ServiceSlot = {
    time: string
    services: Service[]
    extraServices: ExtraService[]
}

export type ServiceSelectionTableProps = {
    slots: ServiceSlot[]
    selectedSlots: SelectedSlot[]
    onSlotChange: (slot: SelectedSlot | null, time: string, service: Service) => void
    onAddOnToggle: (time: string, service: Service, addOn: ExtraService) => void
}