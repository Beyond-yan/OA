package com.gdssoft.oa.action.archive;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.archive.LeaderRead;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.archive.ArchivesDocService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.archive.LeaderReadService;
import com.gdssoft.oa.service.system.AppUserService;
import com.google.gson.Gson;

import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class LeaderReadAction extends BaseAction {
	@Resource
	private LeaderReadService leaderReadService;
	private LeaderRead leaderRead;
	@Resource
	private ArchivesService archivesService;
	@SuppressWarnings("unused")
	@Resource
	private AppUserService appUserService;
	@Resource
	private ArchivesDocService archivesDocService;

	private Long readId;

	private String leaderOpinion;

	private Short isPass;

	private String checkName;

	private Archives archives;

	private Integer depLevel;

	private Long flowAssignId;

	public Integer getDepLevel() {
		return depLevel;
	}

	public void setDepLevel(Integer depLevel) {
		this.depLevel = depLevel;
	}

	public Archives getArchives() {
		return archives;
	}

	public void setArchives(Archives archives) {
		this.archives = archives;
	}

	public Short getIsPass() {
		return isPass;
	}

	public void setIsPass(Short isPass) {
		this.isPass = isPass;
	}

	public String getLeaderOpinion() {
		return leaderOpinion;
	}

	public void setLeaderOpinion(String leaderOpinion) {
		this.leaderOpinion = leaderOpinion;
	}

	public Long getReadId() {
		return readId;
	}

	public void setReadId(Long readId) {
		this.readId = readId;
	}

	public LeaderRead getLeaderRead() {
		return leaderRead;
	}

	public void setLeaderRead(LeaderRead leaderRead) {
		this.leaderRead = leaderRead;
	}

	public String getCheckName() {
		return checkName;
	}

	public void setCheckName(String checkName) {
		this.checkName = checkName;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_userId_L_EQ", ContextUtil.getCurrentUserId()
				.toString());
		filter.addFilter("Q_archives.archType_SN_EQ",
				Archives.ARCHIVE_TYPE_RECEIVE.toString());
		List<LeaderRead> list = leaderReadService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer serializer = JsonUtil.getJSONSerializer("createtime",
				"archives.issueDate", "archives.createtime");
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				leaderReadService.remove(new Long(id));
			}
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		LeaderRead leaderRead = leaderReadService.get(readId);

		Gson gson = new Gson();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(leaderRead));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 保存收发文领导意见,同时根据当前的状态
	 */
	public String save() {
		String strArchivesId = getRequest().getParameter("archivesId");
		if (StringUtils.isNotEmpty(strArchivesId)) {
			LeaderRead leader = new LeaderRead();
			Archives archives = archivesService.get(new Long(strArchivesId));
			AppUser user = ContextUtil.getCurrentUser();
			leader.setArchives(archives);
			leader.setLeaderOpinion(leaderOpinion);
			leader.setIsPass(isPass);
			leader.setDepLevel(depLevel);
			leader.setUserId(user.getUserId());
			leader.setLeaderName(user.getFullname());
			leader.setCreatetime(new Date());
			leader.setCheckName(checkName);

			leaderReadService.save(leader);
			if (depLevel != null && depLevel == 1) {
				String flowAssignId = getRequest().getParameter("flowAssignId");
				if (StringUtils.isNotEmpty(flowAssignId)) {
					archives.setStatus(Archives.STATUS_LEADERCHECK);
				} else {
					archives.setStatus(Archives.STATUS_DISPATCH);
				}
			} else {
				archives.setStatus(Archives.STATUS_DISPATCH);
			}
			// String status=getRequest().getParameter("status");
			// if(StringUtils.isNotEmpty(status)){
			// archives.setStatus(new Short(status));
			// }else{
			// archives.setStatus(Archives.STATUS_DISPATCH);
			// }

			archivesService.save(archives);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String saveDep() {
		System.out.println("archives.getArchivesId:"+archives.getArchivesId());
		archives = archivesService.get(archives.getArchivesId());
		String archivesStatus = getRequest().getParameter("archivesStatus");
		if (StringUtils.isNotEmpty(archivesStatus)) {
			archives.setStatus(Short.parseShort(archivesStatus));
		}
		String isLast = getRequest().getParameter("isLast");
/*		if (isLast != null) {
			if (isLast.equals("last") || isLast == "last") {
				AppUser currentUser = ContextUtil.getCurrentUser();
				List<ArchivesDoc> arDocList = archivesDocService
						.findByAid(archives.getArchivesId());
				List<FileAttach> attachList = new ArrayList<FileAttach>();
				for (ArchivesDoc archivesDoc : arDocList) {
					attachList.add(archivesDoc.getFileAttach());
				}
				RollFile rollFile = new RollFile();
				rollFile.setFileName(archives.getSubject());
				rollFile.setTidyName(currentUser.getFullname());
				rollFile.setTidyTime(new Date());
				rollFileService.autoTidy(rollFile, attachList);
				archives.setStatus((short)7);
			}
		}*/
		archivesService.save(archives);

		leaderRead.setLeaderName(ContextUtil.getCurrentUser().getFullname());
		leaderRead.setUserId(ContextUtil.getCurrentUserId());
		leaderRead.setArchives(archives);
		leaderRead.setCreatetime(new Date());
		leaderRead.setIsPass(LeaderRead.IS_PASS);
		leaderReadService.save(leaderRead);

		setJsonString("{success:true,readId:" + leaderRead.getReadId() + "}");
		return SUCCESS;
	}
	public String saveDepMobile() {
		archives = archivesService.get(archives.getArchivesId());
		String archivesStatus = getRequest().getParameter("archivesStatus");
		if (StringUtils.isNotEmpty(archivesStatus)) {
			archives.setStatus(Short.parseShort(archivesStatus));
		}
		String isLast = getRequest().getParameter("isLast");
		archivesService.save(archives);

		leaderRead.setLeaderName(ContextUtil.getCurrentUser().getFullname());
		leaderRead.setUserId(ContextUtil.getCurrentUserId());
		leaderRead.setArchives(archives);
		leaderRead.setCreatetime(new Date());
		leaderRead.setIsPass(LeaderRead.IS_PASS);
		leaderReadService.save(leaderRead);

		setJsonString("{\"success\":true,\"readId\":\"" + leaderRead.getReadId() + "\"}");
		return SUCCESS;
	}
}
