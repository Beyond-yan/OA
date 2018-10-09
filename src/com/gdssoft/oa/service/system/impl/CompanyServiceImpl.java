package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.dao.system.CompanyDao;
import com.gdssoft.oa.model.system.Company;
import com.gdssoft.oa.service.system.CompanyService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;


public  class CompanyServiceImpl extends BaseServiceImpl<Company> implements
		CompanyService {
	
	private CompanyDao companyDao;
	
	public CompanyServiceImpl(CompanyDao companyDao) {
		super(companyDao);
		this.companyDao=companyDao;
	}

	@Override
	public List<Company> findCompany() {
		
		return companyDao.findCompany();
	}

	@Override
	public List<Company> findByHql(String hql) {
		// TODO Auto-generated method stub
		return null;
	}


}
