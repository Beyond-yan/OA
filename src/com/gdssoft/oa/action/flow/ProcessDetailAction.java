package com.gdssoft.oa.action.flow;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import javax.annotation.Resource;

import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.core.web.action.BaseAction;
/**
 * 流程明细
 * @author csx
 *
 */
public class ProcessDetailAction extends BaseAction {
	@Resource
	private ProDefinitionService proDefinitionService;
	
	private ProDefinition proDefinition;

	public ProDefinition getProDefinition() {
		return proDefinition;
	}

	public void setProDefinition(ProDefinition proDefinition) {
		this.proDefinition = proDefinition;
	}

	@Override
	public String execute() throws Exception {
		String defId=getRequest().getParameter("defId");
		proDefinition=proDefinitionService.get(new Long(defId));
		return SUCCESS;
	}
}
