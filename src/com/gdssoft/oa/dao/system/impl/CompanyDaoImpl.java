package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.system.CompanyDao;
import com.gdssoft.oa.model.system.Company;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class CompanyDaoImpl extends BaseDaoImpl<Company> implements CompanyDao{

	public CompanyDaoImpl() {
		super(Company.class);
	}

	public List<Company> findCompany(){
		String hql = "from Company c";
		return findByHql(hql);
		
	}
	


	
}
