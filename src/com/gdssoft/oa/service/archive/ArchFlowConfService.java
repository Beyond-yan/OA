package com.gdssoft.oa.service.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.model.archive.ArchFlowConf;
import com.gdssoft.core.service.BaseService;

public interface ArchFlowConfService extends BaseService<ArchFlowConf>{
	/**
	 * 根据类型来查找配置
	 * @param archType
	 * @return
	 */
	public ArchFlowConf getByFlowType(Short archType);
}


