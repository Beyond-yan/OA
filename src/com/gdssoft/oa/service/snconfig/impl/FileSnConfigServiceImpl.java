package com.gdssoft.oa.service.snconfig.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.snconfig.FileSnConfigDao;
import com.gdssoft.oa.model.snconfig.FileSnConfig;
import com.gdssoft.oa.service.snconfig.FileSnConfigService;

public class FileSnConfigServiceImpl extends BaseServiceImpl<FileSnConfig> implements FileSnConfigService{
	@SuppressWarnings("unused")
	private FileSnConfigDao dao;
	
	public FileSnConfigServiceImpl(FileSnConfigDao dao) {
		super(dao);
		this.dao=dao;
	}
	/****
	 * 获取收发文编号
	 * @param defId:流程定义id
	 * @param snConfigId：编号方法
	 * @return
	 */
	public String getFlowSnNo(final Long defId,final Long snConfigId){
		return this.dao.getFlowSnNo(defId, snConfigId);
	}
	/****
	 * 获取跨年收发文编号
	 * @param defId:流程定义id
	 * @param snConfigId：编号方法
	 * @return
	 */
	public String getFlowHistorySnNo(final Long snConfigId,final String snYear){
		return this.dao.getFlowHistorySnNo(snConfigId, snYear);
	}
	
	public List<FileSnConfig> getFileSnExcIds(String ids,String snName){
		return this.dao.getFileSnExcIds(ids,snName);
	}

}