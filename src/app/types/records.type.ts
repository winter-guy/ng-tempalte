export type OilDataRecord = {
    _month_: string;
    year: string;
    oil_companies_: string;
    quantity_000_metric_tonnes_: number;
};

export type OilData = {
    index_name: string;
    title: string;
    desc: string;
    created: number;
    updated: number;
    created_date: string;
    updated_date: string;
    active: string;
    visualizable: string;
    catalog_uuid: string;
    source: string;
    org_type: string;
    org: string[];
    sector: string[];
    field: {
        name: string;
        id: string;
        type: string;
    }[];
    target_bucket: {
        index: string;
        type: string;
        field: string;
    };
    message: string;
    version: string;
    status: string;
    total: number;
    count: number;
    limit: string;
    offset: string;
    records: OilDataRecord[];
};
  
  export interface Match {
    time: number;
    value: number;
  }