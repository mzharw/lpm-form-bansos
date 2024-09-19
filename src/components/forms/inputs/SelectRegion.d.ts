export type DivisionType = 'province' | 'regency' | 'district' | 'sub_district'

export interface DataRegion {
    id: string | number,
    province_id?: string | number,
    regency_id?: string | number,
    district_id?: string | number,
    sub_district_id?: string | number,
    name: string,
}
