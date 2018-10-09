package com.gdssoft.oa.service.admin;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.admin.CarCostRecordDetail;

public interface CarCostRecordDetailService extends BaseService<CarCostRecordDetail> {
	public void deleteByRecordId(Long recordId);
}
