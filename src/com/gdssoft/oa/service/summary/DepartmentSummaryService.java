package com.gdssoft.oa.service.summary;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.summary.DepartmentSummary;

public interface DepartmentSummaryService extends BaseService<DepartmentSummary> {

	public List getAll(HttpServletRequest request,QueryFilter queryFilter);
	public List getAllbySumId(HttpServletRequest request,QueryFilter queryFilter);
}
