package com.gdssoft.oa.action.mobile.flow;

import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.core.web.action.BaseAction;

public class MobileProDefAction extends BaseAction{
	@Resource
	private ProDefinitionService proDefinitionService;
	
	public String list(){
		List<ProDefinition> proDefList=proDefinitionService.getAll(getInitPagingBean());
		getRequest().setAttribute("proDefList", proDefList);
		return SUCCESS;
	}
}
