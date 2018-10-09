package com.gdssoft.oa.dao.hrm.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.hrm.StandSalaryItemDao;
import com.gdssoft.oa.model.hrm.StandSalaryItem;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class StandSalaryItemDaoImpl extends BaseDaoImpl<StandSalaryItem> implements StandSalaryItemDao{

	public StandSalaryItemDaoImpl() {
		super(StandSalaryItem.class);
	}

	@Override
	public List<StandSalaryItem> getAllByStandardId(Long standardId) {
		String hql = "from StandSalaryItem ssi where ssi.standSalary.standardId=?";
		return findByHql(hql, new Object[]{standardId});
	}

}