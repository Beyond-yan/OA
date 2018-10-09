package com.gdssoft.oa.dao.admin;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.admin.CarCostRecordDetail;

public interface CarCostRecordDetailDao extends BaseDao<CarCostRecordDetail> {

	
	public void deleteByRecordId(Long recordId);
}
