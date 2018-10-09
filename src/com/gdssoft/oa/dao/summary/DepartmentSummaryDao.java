package com.gdssoft.oa.dao.summary;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.summary.DepartmentSummary;
import com.gdssoft.oa.model.summary.WorkSummary;

public interface DepartmentSummaryDao extends BaseDao<DepartmentSummary>{
	public List getAll(HttpServletRequest requestv,QueryFilter queryFilter);
	public List getAllbySumId(HttpServletRequest requestv,QueryFilter queryFilter);
}
