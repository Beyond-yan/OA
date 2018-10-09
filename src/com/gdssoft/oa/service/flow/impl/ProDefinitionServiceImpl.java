package com.gdssoft.oa.service.flow.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.util.List;
import java.util.Map;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.flow.ProDefinitionDao;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.service.flow.ProDefinitionService;

public class ProDefinitionServiceImpl extends BaseServiceImpl<ProDefinition>
		implements ProDefinitionService {
	private ProDefinitionDao dao;

	public ProDefinitionServiceImpl(ProDefinitionDao dao) {
		super(dao);
		this.dao = dao;
	}

	public ProDefinition getByDeployId(String deployId) {
		return dao.getByDeployId(deployId);
	}

	public ProDefinition getByName(String name) {
		return dao.getByName(name);
	}

	@Override
	public List<ProDefinition> getProDefinitions(Long typeId) {
		// TODO Auto-generated method stub
		return dao.getProDefinitions(typeId);
	}

	public List<ProDefinition> getProDefinitions(String typename,
			String typeNametep,PagingBean pb) {
		return dao.getProDefinitions(typename, typeNametep,pb);

	}
	
	public Map<Long,String> getProDefinitionMap(Long typeId){
		return dao.getProDefinitionMap(typeId);
	}
	
	public List getProDefinitionList(Long typeId){
		return dao.getProDefinitionList(typeId);
	}
}