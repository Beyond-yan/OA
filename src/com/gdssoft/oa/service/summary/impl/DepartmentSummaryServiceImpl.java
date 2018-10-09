package com.gdssoft.oa.service.summary.impl;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.dao.GenericDao;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.summary.DepartmentSummaryDao;
import com.gdssoft.oa.dao.summary.WorkSummaryDao;
import com.gdssoft.oa.model.summary.DepartmentSummary;
import com.gdssoft.oa.service.summary.DepartmentSummaryService;

public class DepartmentSummaryServiceImpl extends BaseServiceImpl<DepartmentSummary> implements DepartmentSummaryService{
	@Resource
	private DepartmentSummaryDao dao;
	public DepartmentSummaryServiceImpl(DepartmentSummaryDao dao) {
		super(dao);
		// TODO Auto-generated constructor stub
	}
	public List getAll(HttpServletRequest request,QueryFilter queryFilter)
	{
		return dao.getAll(request,queryFilter);		
	}
	
	public List getAllbySumId(HttpServletRequest request,QueryFilter queryFilter)
	{
		return dao.getAllbySumId(request,queryFilter);
		
	}
}
