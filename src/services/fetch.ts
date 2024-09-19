import {DataRegion, DivisionType} from "../components/forms/inputs/SelectRegion";

export function getDataRegion(type: DivisionType, id?: string | number): Promise<Array<DataRegion>> {
    const urls: { [key: string]: string } = {
        'province': 'provinces',
        'regency': 'regencies/' + id,
        'district': 'districts/' + id,
        'sub_district': 'villages/' + id,
    }

    const url = `https://www.emsifa.com/api-wilayah-indonesia/api/${urls[type]}.json`
    return fetchData(url);
}

async function fetchData(url: string) {
    return await fetch(url)
        .then(response => response.json())
        .catch(() => {

        })
}