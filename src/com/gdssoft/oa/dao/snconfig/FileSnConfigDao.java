package com.gdssoft.oa.dao.snconfig;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.snconfig.FileSnConfig;

/**
 * @author 
 *
 */
public interface FileSnConfigDao extends BaseDao<FileSnConfig>{
	/****
	 * 获取收发文编号
	 * @param defId:流程定义id
	 * @param snConfigId：编号方法
	 * @return
	 */
	public String getFlowSnNo(final Long defId,final Long snConfigId);
	
	/****
	 * 获取跨年收发文编号
	 * @param defId:流程定义id
	 * @param snConfigId：编号方法
	 * @return
	 */
	public String getFlowHistorySnNo(final Long snConfigId,final String snYear);
	
	public List<FileSnConfig> getFileSnExcIds(String ids,String snName);
}