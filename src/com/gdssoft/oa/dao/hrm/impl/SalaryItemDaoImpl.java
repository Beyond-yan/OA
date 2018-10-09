package com.gdssoft.oa.dao.hrm.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.dao.hrm.SalaryItemDao;
import com.gdssoft.oa.model.hrm.SalaryItem;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.paging.PagingBean;

public class SalaryItemDaoImpl extends BaseDaoImpl<SalaryItem> implements SalaryItemDao{

	public SalaryItemDaoImpl() {
		super(SalaryItem.class);
	}

	@Override
	public List<SalaryItem> getAllExcludeId(String excludeIds,PagingBean pb) {
		String hql = "from SalaryItem ";
		if(StringUtils.isNotEmpty(excludeIds)){
			hql += "where salaryItemId not in("+excludeIds+")";
		}
		return findByHql(hql,null, pb);
	}

}