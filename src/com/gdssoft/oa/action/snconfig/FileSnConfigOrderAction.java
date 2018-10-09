package com.gdssoft.oa.action.snconfig;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.law.Laws;
import com.gdssoft.oa.model.law.LawsAuthor;
import com.gdssoft.oa.model.snconfig.FileSnConfigOrder;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.snconfig.FileSnConfigOrderService;
import com.gdssoft.oa.service.system.AppUserService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class FileSnConfigOrderAction extends BaseAction{
	@Resource
	private FileSnConfigOrderService fileSnConfigOrderService;
	private FileSnConfigOrder fileSnConfigOrder;
	@Resource
	private AppUserService appUserService;
	
	public AppUserService getAppUserService() {
		return appUserService;
	}

	public void setAppUserService(AppUserService appUserService) {
		this.appUserService = appUserService;
	}

	public FileSnConfigOrder getFileSnConfigOrder() {
		return fileSnConfigOrder;
	}

	public void setFileSnConfigOrder(FileSnConfigOrder fileSnConfigOrder) {
		this.fileSnConfigOrder = fileSnConfigOrder;
	}

	private Long id;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public FileSnConfigOrderService getFileSnConfigOrderService() {
		return fileSnConfigOrderService;
	}

	public void setFileSnConfigOrderService(
			FileSnConfigOrderService fileSnConfigOrderService) {
		this.fileSnConfigOrderService = fileSnConfigOrderService;
	}
	
	/**
	 * 显示列表
	 */
	public String listByPage() {

		QueryFilter filter = new QueryFilter(getRequest());
		String flowId = getRequest().getParameter("flowId");
		String userId = getRequest().getParameter("userId");
		String isUsed = getRequest().getParameter("isUsed");
		if (userId != null && !"".equals(userId)) {
			filter.addFilter("Q_userId_L_EQ", userId);
		}
		if (flowId != null && !"".equals(flowId)) {
			filter.addFilter("Q_defId_L_EQ", flowId);
		}
		if (isUsed != null && !"".equals(isUsed)) {
			filter.addFilter("Q_isUsed_N_EQ", isUsed);
		}
		List<FileSnConfigOrder> list = fileSnConfigOrderService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");


		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}
	
	// 类型和名称
		public String list() {
			QueryFilter filter = new QueryFilter(getRequest());
			String flowId = getRequest().getParameter("flowId");
			String userId = getRequest().getParameter("userId");
			if (flowId != null && !"".equals(flowId)) {
				filter.addFilter("Q_defId_L_EQ", flowId);
			}
			if (userId != null && !"".equals(userId)) {
				filter.addFilter("Q_userId_L_EQ", userId);
			}
			filter.addFilter("Q_isUsed_N_EQ", "0");
			List<FileSnConfigOrder> list = fileSnConfigOrderService.getAll(filter);
			StringBuffer sb = new StringBuffer();
			sb.append("[");
			for (FileSnConfigOrder fileSnConfigOrder : list) {
				sb.append("['").append(fileSnConfigOrder.getId()).append("','")
						.append(fileSnConfigOrder.getOrderSnName()).append("']");
				sb.append(",");
			}
			sb.deleteCharAt(sb.length() - 1);// 删除最后一个","字符
			sb.append("]");
			this.setJsonString(sb.toString());
			return SUCCESS;
		}
		
	/**
	 * 获取编号办法
	 */
	public String getFileSigId(){
		QueryFilter filter = new QueryFilter(getRequest());
		String flowId = getRequest().getParameter("flowId");
		Long sigId = null;
		filter.addFilter("Q_id_L_EQ", flowId);
		List<FileSnConfigOrder> list = fileSnConfigOrderService.getAll(filter);
		StringBuffer sb = new StringBuffer();
		if(0 != list.size()){
			sb.append("{success:true,data:'");
			sigId = list.get(0).getFileSnConfig().getId();
			sb.append(sigId + "'");
		}else{
			sb.append("{success:failed,data:'snConfigId is null!'");
		}
		sb.append("}");
		this.setJsonString(sb.toString());
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save(){
		AppUser currentUser = ContextUtil.getCurrentUser();
		String orderId = getRequest().getParameter("orderId");
		String userId = getRequest().getParameter("userId");
        if(orderId==null){
			fileSnConfigOrder.setCreateUser(currentUser.getFullname());
			fileSnConfigOrder.setIsUsed(0);
			fileSnConfigOrder.setCreateDate(new Date());
			fileSnConfigOrderService.save(fileSnConfigOrder);
		}else{
			FileSnConfigOrder fileSnConfigOrder=new FileSnConfigOrder();
			//fileSnConfigOrder.setUserId(Long.valueOf(userId));
			fileSnConfigOrder.setIsUsed(1);
			FileSnConfigOrder orgFileSnConfigOrder= fileSnConfigOrderService.get(Long.valueOf(orderId));
			try{
				BeanUtil.copyNotNullProperties(orgFileSnConfigOrder, fileSnConfigOrder);
				fileSnConfigOrderService.save(orgFileSnConfigOrder);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
