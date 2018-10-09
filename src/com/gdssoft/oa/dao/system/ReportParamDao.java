package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.system.ReportParam;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface ReportParamDao extends BaseDao<ReportParam>{
	/**
	 * 根据ID来查找参数
	 * @param reportId
	 * @return
	 */
	public List<ReportParam> findByRepTemp(Long reportId);
}