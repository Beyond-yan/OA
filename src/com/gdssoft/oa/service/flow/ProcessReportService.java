package com.gdssoft.oa.service.flow;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.flow.ProcessReport;
import com.gdssoft.oa.model.system.AppUser;

public interface ProcessReportService extends BaseService<ProcessReport> {
	
	/**
	 * 过滤查询出来的数据记录，并翻页处理
	 * @param request     传递页面查询参数
	 * @param queryFilter 查询过滤器，翻页
	 * @param currentUser 当前登录用户
	 * @return
	 */

	public List<ProcessReport> getbyauth
	(HttpServletRequest request,QueryFilter queryFilter,AppUser currentUser) ;
}
