package com.gdssoft.oa.service.flow;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.util.List;
import java.util.Map;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.flow.ProDefinition;

public interface ProDefinitionService extends BaseService<ProDefinition> {
	public ProDefinition getByDeployId(String deployId);

	public ProDefinition getByName(String name);

	/**
	 * 
	 * 根据流程分类Id获取指定的流程
	 * 
	 * @param typeId
	 * @return
	 */
	public List<ProDefinition> getProDefinitions(Long typeId);

	/**
	 * 
	 * 根据类型名称获取流程
	 * 
	 * @param typename
	 * @param typeNametep
	 * @return
	 */
	public List<ProDefinition> getProDefinitions(String typename,
			String typeNametep,PagingBean pb);
	
	public Map<Long,String> getProDefinitionMap(Long typeId);
	public List getProDefinitionList(Long typeId);
}
