package com.gdssoft.oa.action.reports;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.dbcp.BasicDataSource;

import com.gdssoft.core.util.DateUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.LeaderRead;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.reports.DoucmentReivewResponse;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.admin.CarApplyService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.archive.OdPersonalSignService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.util.ListComparator;
import com.gdssoft.oa.util.MoneyUtil;

import edu.emory.mathcs.backport.java.util.Collections;

public class ArchivesReceiveOutsideReportAction extends BaseAction {

	private HashMap params = new HashMap();
	private List<BasicDataSource> dataSource;
	private List<LeaderRead> leaderReadDataSource;
	private List<DoucmentReivewResponse> documentDataSource;
	private Long runId;
	
	@Resource
	private ArchivesService archivesService;
	@Resource

	private AppUserService 	appUserService;
	@Resource
	private DepartmentService departmentService;	
	@Resource
	private ProcessFormService processFormService;
	@Resource
	private OdPersonalSignService odPersonalSignService;
	SimpleDateFormat sdf=new SimpleDateFormat("yyyy年MM月dd日");	
	
	private SimpleDateFormat sdf_time = new SimpleDateFormat("HH:mm");	//20121016 xt
	private SimpleDateFormat sdf_date = new SimpleDateFormat("yyyy年MM月dd日 HH:mm"); //20121016 xt
	
	@Resource
	private CarApplyService carApplyService;

	/**
	 * 运营公司外收文
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getReport() {
		
		//发文实体
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			params.put("issueDep", archives.getIssueDep());
			params.put("archivesNo", archives.getArchivesNo());
			params.put("depSignNo", archives.getDepSignNo());
			params.put("urgentLevel", archives.getUrgentLevel());
			params.put("issueDate", archives.getIssueDate().toLocaleString());
			params.put("subject", archives.getSubject());
			
			ProcessForm  pf = processFormService.getByRunIdActivityName(archives.getProcessRun().getRunId(),"拟办");
			params.put("leaderOpinion1", this.getLeaderName(pf.getCreatorId())+"("+this.getDepName(pf.getCreatorId())+"--"+DateUtil.formatEnDate(pf.getCreatetime())+")"+pf.getComments());
			
			ProcessForm  pfs = processFormService.getByRunIdActivityName(archives.getProcessRun().getRunId(),"审批");
			params.put("leaderOpinion2", this.getLeaderName(pfs.getCreatorId())+"("+this.getDepName(pfs.getCreatorId())+"--"+DateUtil.formatEnDate(pfs.getCreatetime())+")"+pfs.getComments());
			//子流程审批列表
			List<LeaderRead> leaderReads = new ArrayList<LeaderRead>();
			
			Long archivesId = archives.getArchivesId();
			//获取子流程
			List<Archives> subArcivesList = archivesService.getArchivesByParentId(archivesId);
			ProcessRun processRun=null;
			for(Archives subArchive : subArcivesList){
				processRun=subArchive.getProcessRun();
				String piId = processRun.getPiId();
				Short runStatus= processRun.getRunStatus();
				LeaderRead  leaderRead = new LeaderRead();
				if(runStatus == 2){
					
					ProcessForm  pf1 = processFormService.getByRunIdActivityName(processRun.getRunId(),"部门分管负责人批文");
					if( pf1!= null && pf1.getStatus().equals("结束")){
						leaderRead.setDepName(this.getDepName(pf1.getCreatorId()));
						leaderRead.setLeaderOpinion(pf1.getComments());
						leaderRead.setLeaderName(this.getLeaderName(pf1.getCreatorId()));
						leaderRead.setCreatetime(pf1.getCreatetime());
						leaderReads.add(leaderRead);
						continue;
					}
					ProcessForm  pf2 = processFormService.getByRunIdActivityName(processRun.getRunId(),"室经理收文处理");
					if( pf2!= null &&  pf2.getStatus().equals("结束")){
						leaderRead.setDepName(this.getDepName(pf2.getCreatorId()));
						leaderRead.setLeaderOpinion(pf2.getComments());
						leaderRead.setLeaderName(this.getLeaderName(pf2.getCreatorId()));
						leaderRead.setCreatetime(pf2.getCreatetime());
						leaderReads.add(leaderRead);
						continue;
					}
					
					ProcessForm  pf3 = processFormService.getByRunIdActivityName(processRun.getRunId(),"工班长收文处理");
					if( pf3!= null && pf3.getStatus().equals("结束")){
						leaderRead.setDepName(this.getDepName(pf3.getCreatorId()));
						leaderRead.setLeaderOpinion(pf3.getComments());
						leaderRead.setLeaderName(this.getLeaderName(pf3.getCreatorId()));
						leaderRead.setCreatetime(pf3.getCreatetime());
						leaderReads.add(leaderRead);
						continue;
					}
					
					ProcessForm  pf4 = processFormService.getByRunIdActivityName(processRun.getRunId(),"承办人收文处理");
					if( pf4!= null && pf4.getStatus().equals("结束")){
						leaderRead.setDepName(this.getDepName(pf4.getCreatorId()));
						leaderRead.setLeaderOpinion(pf4.getComments());
						leaderRead.setLeaderName(this.getLeaderName(pf4.getCreatorId()));
						leaderRead.setCreatetime(pf4.getCreatetime());
						leaderReads.add(leaderRead);
						continue;
					}
					
					
					
				}
			}
			leaderReadDataSource = leaderReads;
			
			ListComparator c = new ListComparator("getReadId");
			Collections.sort(leaderReads, c);

			String subReportPath = getRequest().getRealPath("/pages/reportTemplet/ReceivesFileOutside/");
			subReportPath = subReportPath.replace('\\', '/');
			System.out.println("subReportPath:"+subReportPath);
			params.put("SUBREPORT_DIR",subReportPath+"/");
			params.put("subReportDataList", leaderReads);
		}
		return SUCCESS;
	}
	/**
	 * 导出文件会签单旧版
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getFileHuiQianOldReport() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		Long archivesId = archives.getArchivesId();
		
		if(archives.getProcessRun().getRunStatus() == 2){
			ProcessForm  pf = processFormService.getByRunIdActivityName(archives.getProcessRun().getRunId(),"部门部长审核");
			params.put("depOpinion", pf.getComments());
			params.put("bzName", pf.getCreatorName());
			params.put("bzDate", pf.getCreatetime());
		}
		//获取子流程
		List<Archives> subArcivesList = archivesService.getArchivesByParentId(archivesId);
		if (null != archives) {
			params.put("subject", archives.getSubject());
			params.put("issuer", archives.getIssuer());
			params.put("issueDep", archives.getIssueDep());
			params.put("issueDate", archives.getIssueDate());
			params.put("archivesNo", archives.getArchivesNo());
			
			
			List<LeaderRead> leaderReads = new ArrayList<LeaderRead>();
			ProcessRun processRun=null;
			for(Archives subArchive : subArcivesList){
				processRun=subArchive.getProcessRun();
				String piId = processRun.getPiId();
				Short runStatus= processRun.getRunStatus();
				LeaderRead  leaderRead = new LeaderRead();
					
					ProcessForm  pf1 = processFormService.getByRunIdActivityName(processRun.getRunId(),"部门部长指派");
					if( pf1!= null && pf1.getStatus().equals("结束")){
						leaderRead.setDepName(this.getDepName(pf1.getCreatorId()));
						leaderRead.setLeaderOpinion(pf1.getComments());
						leaderRead.setLeaderName(this.getLeaderName(pf1.getCreatorId()));
						leaderRead.setCreatetime(pf1.getCreatetime());
						leaderReads.add(leaderRead);
						continue;
					}
					ProcessForm  pf2 = processFormService.getByRunIdActivityName(processRun.getRunId(),"室经理指派");
					if( pf2!= null &&  pf2.getStatus().equals("呈部门分管负责人审核")){
						leaderRead.setDepName(this.getDepName(pf2.getCreatorId()));
						leaderRead.setLeaderOpinion(pf2.getComments());
						leaderRead.setLeaderName(this.getLeaderName(pf2.getCreatorId()));
						leaderRead.setCreatetime(pf2.getCreatetime());
						leaderReads.add(leaderRead);
						continue;
					}
					ProcessForm  pf3 = processFormService.getByRunIdActivityName(processRun.getRunId(),"收文承办");
					if( pf3!= null && pf3.getStatus().equals("呈部门分管负责人审核")){
						leaderRead.setDepName(this.getDepName(pf3.getCreatorId()));
						leaderRead.setLeaderOpinion(pf3.getComments());
						leaderRead.setLeaderName(this.getLeaderName(pf3.getCreatorId()));
						leaderRead.setCreatetime(pf3.getCreatetime());
						leaderReads.add(leaderRead);
						continue;
					}
			}
			leaderReadDataSource = leaderReads;
			
		}
		return SUCCESS;
	}
	/**
	 * 导出文件会签单V1
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getFileHuiQianReport() {
		System.out.println("ruanId:"+runId);

		//父流程
		Archives archives = archivesService.getArchivesByRunId(runId);
		Long archivesId = archives.getArchivesId();
		
		String imagePath = getRequest().getRealPath("/attachFiles/");
		imagePath = imagePath.replace('\\', '/');
		String namePicPath = null;
		if(archives.getProcessRun().getRunStatus() == 2){
			ProcessForm  pf = processFormService.getByRunIdActivityName(archives.getProcessRun().getRunId(),"部门分管负责人审核");
			params.put("depOpinion", pf.getComments());
			namePicPath = odPersonalSignService.getOdPersonSign(pf.getCreatorId());
			System.out.println("------namePicPath:"+namePicPath);
			if(namePicPath == null){
				params.put("bzName", pf.getCreatorName());
			}else{
				params.put("imagePath", imagePath+"/"+namePicPath);
			}
			params.put("bzDate", pf.getCreatetime());
		}
		//获取子流程
		List<Archives> subArcivesList = archivesService.getArchivesByParentId(archivesId);
		if (null != archives) {
			params.put("subject", archives.getSubject());
			params.put("issuer", archives.getIssuer());
			params.put("issueDep", archives.getIssueDep());
			params.put("issueDate", archives.getIssueDate());
			params.put("archivesNo", archives.getArchivesNo());
			
			List<LeaderRead> leaderReads = new ArrayList<LeaderRead>();
			ProcessRun processRun=null;
			for(Archives subArchive : subArcivesList){
				processRun=subArchive.getProcessRun();
				String piId = processRun.getPiId();
				Short runStatus= processRun.getRunStatus();
				LeaderRead  leaderRead = new LeaderRead();
				//if(runStatus == 2){
					
					ProcessForm  pf1 = processFormService.getByRunIdActivityName(processRun.getRunId(),"承办人收文处理");
					if( pf1!= null && pf1.getStatus().equals("呈部门分管负责人确认")){
						leaderRead.setDepName(this.getDepName(pf1.getCreatorId()));
						leaderRead.setLeaderOpinion(pf1.getComments());
						leaderRead.setLeaderName(this.getLeaderName(pf1.getCreatorId()));
						leaderRead.setCreatetime(pf1.getCreatetime());
						leaderReads.add(leaderRead);
						continue;
					}
					ProcessForm  pf2 = processFormService.getByRunIdActivityName(processRun.getRunId(),"室经理收文处理");
					if( pf2!= null &&  pf2.getStatus().equals("呈部门分管负责人确认")){
						leaderRead.setDepName(this.getDepName(pf2.getCreatorId()));
						leaderRead.setLeaderOpinion(pf2.getComments());
						leaderRead.setLeaderName(this.getLeaderName(pf2.getCreatorId()));
						leaderRead.setCreatetime(pf2.getCreatetime());
						leaderReads.add(leaderRead);
						continue;
					}
					ProcessForm  pf3 = processFormService.getByRunIdActivityName(processRun.getRunId(),"部门分管负责人批文");
					if( pf3!= null && pf3.getStatus().equals("交发起人回复意见")){
						leaderRead.setDepName(this.getDepName(pf3.getCreatorId()));
						leaderRead.setLeaderOpinion(pf3.getComments());
						leaderRead.setLeaderName(this.getLeaderName(pf3.getCreatorId()));
						leaderRead.setCreatetime(pf3.getCreatetime());
						leaderReads.add(leaderRead);
						continue;
					}
					
				//}
			}
			leaderReadDataSource = leaderReads;
		}
		return SUCCESS;
	
	}
	
	public String getDepName(Long userId) {
		Department dept = appUserService.get(userId).getDepartment();
		Department deptLevel3 = departmentService.get3LevelDept(dept);
		return deptLevel3.getDepName();
	}
	public String getLeaderName(Long userId) {
		return appUserService.get(userId).getFullname();
	}
	
	/**
	 * 导出文本评审单旧版
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getDocumentReviewReport() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			params.put("subject", archives.getSubject());
			params.put("issuer", archives.getIssuer());
			params.put("issueDep", archives.getIssueDep());
			System.out.println("issueDep:"+archives.getIssueDep());
			params.put("issueDate", archives.getIssueDate().toLocaleString());
			params.put("archivesNo", archives.getArchivesNo());
			
			List<LeaderRead> leaderReads = new ArrayList<LeaderRead>();
			Set<LeaderRead> leaderSet = archives.getLeaders();
			if(null != leaderSet) {
				for(LeaderRead obj:leaderSet){
					System.out.println("bool----"+obj.getCheckName().equals("部门部长审核"));
					if(obj.getCheckName().equals("部门部长审核")){
						params.put("depOpinion", obj.getLeaderName()+"("+obj.getDepName()+"--"+DateUtil.formatEnDate(obj.getCreatetime())+")"+obj.getLeaderOpinion());
					}else{
						leaderReads.add(obj);
					}
				}
			}
			
			
			leaderReadDataSource = leaderReads;
		}
		return SUCCESS;
	}
	
	/**
	 * 导出文本评审单V1--文本评审表
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getDocumentReviewV1Report() {
		//父流程
		Archives archives = archivesService.getArchivesByRunId(runId);
		Long archivesId = archives.getArchivesId();
		//获取子流程
		List<Archives> subArcivesList = archivesService.getArchivesByParentId(archivesId);
		if (null != archives) {
			//议题名称
			params.put("subject", archives.getSubject());
			params.put("issuer", archives.getIssuer());
			params.put("orgDept", archives.getIssueDep());
			params.put("issueDate", archives.getIssueDate().toLocaleString());
			params.put("archivesNo", archives.getArchivesNo());
			//版本修订
			params.put("typeName", archives.getTypeName());
			
			ProcessForm  pfp = processFormService.getByRunIdActivityName(archives.getProcessRun().getRunId(),"部门分管负责人审核");
			params.put("psDate", pfp.getCreatetime());
			List<DoucmentReivewResponse> leaderReads = new ArrayList<DoucmentReivewResponse>();
			ProcessRun processRun=null;
			for(Archives subArchive : subArcivesList){
				processRun=subArchive.getProcessRun();
				String piId = processRun.getPiId();
				Short runStatus= processRun.getRunStatus();
				
				String imagePath = getRequest().getRealPath("/attachFiles/");
				imagePath = imagePath.replace('\\', '/');
				if(runStatus == 2){
					String namePicPath = null;
					List pfList=processFormService.getByRunId(processRun.getRunId());
					//有几个子流程就产生几笔记录，就产生几个评审单 
					DoucmentReivewResponse  doucmentReivewResponse = new DoucmentReivewResponse();
					doucmentReivewResponse.setPsDepName(subArchive.getRecDepNames());
					for(Object o : pfList){
						ProcessForm  pf = (ProcessForm)o;
						if(pf.getActivityName().equals("部门分管负责人批文") && pf.getStatus().equals("交发起人回复")){
							doucmentReivewResponse.setBzOpinion(pf.getComments());
							doucmentReivewResponse.setBzName(pf.getCreatorName());
							namePicPath = odPersonalSignService.getOdPersonSign(pf.getCreatorId());
							if(namePicPath != null){
								doucmentReivewResponse.setBzNamePic(imagePath+"/"+namePicPath);
							}
							doucmentReivewResponse.setQrDate(pf.getCreatetime());
							continue;
						}
						if(pf.getActivityName().equals("室经理收文处理") && pf.getStatus().equals("部门分管负责人确认")){
							doucmentReivewResponse.setCbOpinion(pf.getComments());
							doucmentReivewResponse.setCbName(pf.getCreatorName());
							doucmentReivewResponse.setCbDate(pf.getCreatetime());
							continue;
						}
						if(pf.getActivityName().equals("承办人收文处理")){
							doucmentReivewResponse.setCbOpinion(pf.getComments());
							doucmentReivewResponse.setCbName(pf.getCreatorName());
							doucmentReivewResponse.setCbDate(pf.getCreatetime());
							continue;
						}
						if(pf.getActivityName().equals("部门分管负责人确认")){
							doucmentReivewResponse.setBzOpinion(pf.getComments());
							doucmentReivewResponse.setBzName(pf.getCreatorName());
							doucmentReivewResponse.setQrDate(pf.getCreatetime());
							namePicPath = odPersonalSignService.getOdPersonSign(pf.getCreatorId());
							if(namePicPath != null){
								doucmentReivewResponse.setBzNamePic(imagePath+"/"+namePicPath);
							}
							continue;
						}
						if(pf.getActivityName().equals("发起人意见回复")){
							doucmentReivewResponse.setHfOpinion(pf.getComments());
							doucmentReivewResponse.setHfName(pf.getCreatorName());
							doucmentReivewResponse.setHfDate(pf.getCreatetime());
							continue;
						}
					}
					leaderReads.add(doucmentReivewResponse);
				}
			}
			System.out.println("leaderReads:"+leaderReads.size());
			documentDataSource = leaderReads;
		}
		return SUCCESS;
	}
	
	/**
	 * 导出文本评审单V1--文本审批表
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getDocumentSpV1Report() {
		//父流程
		Archives archives = archivesService.getArchivesByRunId(runId);
		Long archivesId = archives.getArchivesId();
		//获取子流程
		List<Archives> subArcivesList = archivesService.getArchivesByParentId(archivesId);
		String imagePath = getRequest().getRealPath("/attachFiles/");
		imagePath = imagePath.replace('\\', '/');
		if (null != archives) {
			//文本名称
			params.put("subject", archives.getSubject());
			//拟稿人
			params.put("issuer", archives.getIssuer());
			//拟稿部门
			params.put("issueDept", archives.getIssueDep());
			//文本编号
			params.put("archivesNo", archives.getArchivesNo());
			//拟稿日期
			params.put("issueDate", archives.getIssueDate());
			//版本修订
			params.put("typeName", archives.getTypeName());
			//父流程审批信息
			ProcessForm  pfp1 = processFormService.getByRunIdActivityName(archives.getProcessRun().getRunId(),"部门分管负责人核稿");
			String namePicPath = null;
			if(pfp1!=null){
				params.put("fzOpinion", pfp1.getComments());
				params.put("fzName", pfp1.getCreatorName());
				namePicPath = odPersonalSignService.getOdPersonSign(pfp1.getCreatorId());
				if(namePicPath== null){
					params.put("fzName", pfp1.getCreatorName());
				}else{
					params.put("fzNamePic", imagePath+"/"+namePicPath);
				}
				params.put("fzDate", pfp1.getCreatetime());
			}
			ProcessForm  pfp2 = processFormService.getByRunIdActivityName(archives.getProcessRun().getRunId(),"分管领导审核");
			if(pfp2!=null){
				params.put("fgOpinion", pfp2.getComments());
				namePicPath = odPersonalSignService.getOdPersonSign(pfp2.getCreatorId());
				if(namePicPath== null){
					params.put("fgName", pfp2.getCreatorName());
				}else{
					params.put("fgNamePic", imagePath+"/"+namePicPath);
				}
				params.put("fgDate", pfp2.getCreatetime());
			}
			ProcessForm  pfp3 = processFormService.getByRunIdActivityName(archives.getProcessRun().getRunId(),"总经理审批");
			if(pfp3!=null){
				params.put("zjOpinion", pfp3.getComments());
				
				namePicPath = odPersonalSignService.getOdPersonSign(pfp3.getCreatorId());
				if(namePicPath== null){
					params.put("zjName", pfp3.getCreatorName());
				}else{
					params.put("zjNamePic", imagePath+"/"+namePicPath);
				}
				params.put("zjDate", pfp3.getCreatetime());
			}
			
			
		}
		return SUCCESS;
	}
	
	/**
	 * 提交经营班子会议议题及材料审批表旧版
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getJingYingBanZiHui() {
		System.out.println("ruanId:"+runId);
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			System.out.println("getIssuer:"+archives.getIssuer());
			System.out.println("getIssueDep:"+archives.getIssueDep());
			//议题名称
			params.put("subject", archives.getSubject());
			//回报人
			params.put("issuer", archives.getIssuer());
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issueDate", archives.getIssueDate().toLocaleString());
			//其他参会单位或部门
			params.put("recDepNames", archives.getRecDepNames());
			//主要内容
			params.put("shortContent", archives.getShortContent());
			
			List<LeaderRead> leaderReads = new ArrayList<LeaderRead>();
			Set<LeaderRead> leaderSet = archives.getLeaders();
			if(null != leaderSet) {
				for(LeaderRead obj:leaderSet){
					System.out.println("bool----"+obj.getCheckName().equals("部门部长审核"));
					if(obj.getCheckName().equals("部门部长审核")){
						params.put("depOpinion", obj.getLeaderName()+"("+obj.getDepName()+"--"+DateUtil.formatEnDate(obj.getCreatetime())+")"+obj.getLeaderOpinion());
					}else if(obj.getCheckName().equals("分管领导审核")){
						params.put("fgManager", obj.getLeaderName()+"("+obj.getDepName()+"--"+DateUtil.formatEnDate(obj.getCreatetime())+")"+obj.getLeaderOpinion());
					}else if(obj.getCheckName().equals("总经理审批")){
						params.put("genManager",obj.getLeaderName()+"("+obj.getDepName()+"--"+DateUtil.formatEnDate(obj.getCreatetime())+")"+ obj.getLeaderOpinion());
					}else{
						leaderReads.add(obj);
					}
				}
			}
			
			
			leaderReadDataSource = leaderReads;
		}
		return SUCCESS;
	}
	/**
	 * 提交经营班子会议议题及材料审批表
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getJingYingBanZiHuiV1() {
		System.out.println("ruanId:"+runId);
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			//议题名称
			params.put("subject", archives.getSubject());
			//汇报人
			params.put("issuer", archives.getIssuer());
			System.out.println("archives.getIssuer():"+archives.getIssuer());
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issueDate", archives.getIssueDate());
			//其他参会单位或部门
			params.put("recDepNames", archives.getRecDepNames());
			//主要内容
			params.put("shortContent", archives.getShortContent());
			ProcessRun processRun=archives.getProcessRun();
			Short runStatus= processRun.getRunStatus();
			//收集会签意见
			List<LeaderRead> leaderReads = new ArrayList<LeaderRead>();
			String imagePath = getRequest().getRealPath("/attachFiles/");
			imagePath = imagePath.replace('\\', '/');
			
			if(runStatus == 2){
				String namePicPath = null;
				ProcessForm  pf = processFormService.getByRunIdActivityName(processRun.getRunId(),"部门分管负责人审核");
				if(pf!=null){
					params.put("depOpinion", pf.getComments());
					params.put("bzTime", pf.getCreatetime());
					System.out.println("namePicPath:"+namePicPath);
					if(namePicPath != null){
						params.put("bzNamePic",imagePath+"/"+odPersonalSignService.getOdPersonSign(pf.getCreatorId()));
					}else{
						params.put("bzName", pf.getCreatorName());
					}
				}
				
				List pfList=processFormService.getByRunId(processRun.getRunId());
				
				for(Object o : pfList){
					ProcessForm  pf1 = (ProcessForm)o;
					namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
					
					if(pf1!= null && pf1.getActivityName().equals("相关部门部长意见")){
						LeaderRead obj = new LeaderRead();
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setLeaderName(pf1.getCreatorName());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}
						System.out.println(imagePath+"/"+namePicPath);
						System.out.println("pf1.getCreatorName()"+pf1.getCreatorName());
						obj.setCreatetime(pf1.getCreatetime());
						leaderReads.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("分管领导审核")){
						params.put("fgManager", pf1.getComments());
						params.put("fgTime", pf1.getCreatetime());
						
						if(namePicPath != null){
							params.put("fgNamePic",imagePath+"/"+odPersonalSignService.getOdPersonSign(pf1.getCreatorId()));
						}else{
							params.put("fgName", pf1.getCreatorName());
						}
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("总经理审核")){
						params.put("genManager", pf1.getComments());
						params.put("genTime", pf1.getCreatetime());
						if(namePicPath != null){
							params.put("genNamePic",imagePath+"/"+odPersonalSignService.getOdPersonSign(pf1.getCreatorId()));
						}else{
							params.put("genName", pf1.getCreatorName());
						}
						continue;
					}
				}
			}
			leaderReadDataSource = leaderReads;
			String subReportPath = getRequest().getRealPath("/pages/reportTemplet/fileHuiqian/");
			subReportPath = subReportPath.replace('\\', '/');
			params.put("SUBREPORT_DIR",subReportPath+"/");
			//params.put("subReportDataList", leaderReads1);
		}
		return SUCCESS;
	}
	/**
	 * 红头文件-请示
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getRedHeadQS() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			//议题名称
			params.put("subject", archives.getSubject());
			//回报人
			params.put("issuer", archives.getIssuer());
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issueDate", archives.getIssueDate().toLocaleString());
			//其他参会单位或部门
			params.put("recDepNames", archives.getRecDepNames());
			//主要内容
			params.put("shortContent", archives.getShortContent());
			params.put("archivesNo", archives.getArchivesNo());
			
			params.put("privacyLevel", archives.getPrivacyLevel());
			
			List<LeaderRead> leaderReads1 = new ArrayList();
			List<LeaderRead> leaderReads2 = new ArrayList();
			ProcessRun processRun=archives.getProcessRun();
			Short runStatus= processRun.getRunStatus();
			
			String imagePath = getRequest().getRealPath("/attachFiles/");
			imagePath = imagePath.replace('\\', '/');
			
			if(runStatus == 2){
				List pfList=processFormService.getByRunId(archives.getProcessRun().getRunId());

				String namePicPath = null;
				for(Object o : pfList){
					ProcessForm  pf1 = (ProcessForm)o;
					
					
					
					LeaderRead obj = new LeaderRead();
					if(pf1!= null && pf1.getActivityName().equals("室经理审核")){
						obj.setReadId(pf1.getFormId());
						obj.setLeaderName(pf1.getCreatorName());
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						
						leaderReads1.add(obj);
						
						
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("部门分管负责人审核")){
						obj.setReadId(pf1.getFormId());
						namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads1.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("相关部门部长意见")){
						obj.setReadId(pf1.getFormId());
						namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads1.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("分管领导审核")){
						obj.setReadId(pf1.getFormId());
						namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads2.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("总经理审批")){
						obj.setReadId(pf1.getFormId());
						
						namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads2.add(obj);
						continue;
					}
				}
				
				String subReportPath = getRequest().getRealPath("/pages/reportTemplet/redHead/");
				subReportPath = subReportPath.replace('\\', '/');
				System.out.println("leaderReads1:"+leaderReads1);
				params.put("SUBREPORT_DIR",subReportPath+"/");
				params.put("subReportDataList", leaderReads1);
				
				params.put("SUBREPORT_DIR2",subReportPath+"/");
				params.put("subReportDataList2", leaderReads2);
				
			}
		}
		return SUCCESS;
	}
	
	/**
	 * 红头文件-外发文
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getRedHeadWFW() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			//议题名称
			params.put("subject", archives.getSubject());
			//回报人
			params.put("issuer", archives.getIssuer());
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issueDate", archives.getIssueDate().toLocaleString());
			//其他参会单位或部门
			params.put("recDepNames", archives.getRecDepNames());
			//主要内容
			params.put("shortContent", archives.getShortContent());
			params.put("archivesNo", archives.getArchivesNo());
			
			params.put("privacyLevel", archives.getPrivacyLevel());
			
			List<LeaderRead> leaderReads1 = new ArrayList();
			List<LeaderRead> leaderReads2 = new ArrayList();
			ProcessRun processRun=archives.getProcessRun();
			Short runStatus= processRun.getRunStatus();
			
			String imagePath = getRequest().getRealPath("/attachFiles/");
			imagePath = imagePath.replace('\\', '/');
			
			//if(runStatus == 2){
				List pfList=processFormService.getByRunId(archives.getProcessRun().getRunId());
				String namePicPath = null;
				for(Object o : pfList){
					ProcessForm  pf1 = (ProcessForm)o;
					namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
					LeaderRead obj = new LeaderRead();
					System.out.println("室经理审核:");
					if(pf1!= null && pf1.getActivityName().equals("室经理审核")){
						obj.setReadId(pf1.getFormId());
						obj.setLeaderName(this.getLeaderName(pf1.getCreatorId()));
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads1.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("部门分管负责人审核")){
						obj.setReadId(pf1.getFormId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads1.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("相关部门部长意见")){
						obj.setReadId(pf1.getFormId());
						namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads1.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("分管领导审核")){
						obj.setReadId(pf1.getFormId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads2.add(obj);
						continue;
					}					
					if(pf1!= null && pf1.getActivityName().equals("总经理审批")){
						obj.setReadId(pf1.getFormId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads2.add(obj);
						continue;
					}
				//}
				
				String subReportPath = getRequest().getRealPath("/pages/reportTemplet/redHead/");
				subReportPath = subReportPath.replace('\\', '/');
				System.out.println("leaderReads1:"+leaderReads1);
				params.put("SUBREPORT_DIR",subReportPath+"/");
				params.put("subReportDataList", leaderReads1);
				
				params.put("SUBREPORT_DIR2",subReportPath+"/");
				params.put("subReportDataList2", leaderReads2);
				
			}
		}
		return SUCCESS;
	}
	/**
	 * 红头文件-内发文
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getRedHeadNFW() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			//议题名称
			params.put("subject", archives.getSubject());
			//回报人
			params.put("issuer", archives.getIssuer());
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issueDate", archives.getIssueDate().toLocaleString());
			//其他参会单位或部门
			params.put("recDepNames", archives.getRecDepNames());
			//主要内容
			params.put("shortContent", archives.getShortContent());
			params.put("archivesNo", archives.getArchivesNo());
			
			params.put("privacyLevel", archives.getPrivacyLevel());
			
			//xintong 20121025 新增印章 start			
			String signPath = getRequest().getRealPath("/images/");
			signPath = signPath.replace('\\', '/');
			params.put("companySign",signPath+"/"+"companySign.jpg");
			System.out.println("companySign:"+params.get("companySign"));
			//xintong 20121025 新增印章 end
			
			List<LeaderRead> leaderReads1 = new ArrayList();
			List<LeaderRead> leaderReads2 = new ArrayList();
			ProcessRun processRun=archives.getProcessRun();
			Short runStatus= processRun.getRunStatus();
			String imagePath = getRequest().getRealPath("/attachFiles/");
			imagePath = imagePath.replace('\\', '/');
			if(runStatus == 2){
				List pfList=processFormService.getByRunId(archives.getProcessRun().getRunId());
				String namePicPath = null;
				for(Object o : pfList){
					ProcessForm  pf1 = (ProcessForm)o;
					namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
					LeaderRead obj = new LeaderRead();
					if(pf1!= null && pf1.getActivityName().equals("室经理审核")){
						obj.setReadId(pf1.getFormId());
						obj.setLeaderName(this.getLeaderName(pf1.getCreatorId()));
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads1.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("部门分管负责人审核")){
						obj.setReadId(pf1.getFormId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads1.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("相关部门部长意见")){
						obj.setReadId(pf1.getFormId());
						namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads1.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("分管领导审核")){
						obj.setReadId(pf1.getFormId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads2.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("总经理审批")){
						obj.setReadId(pf1.getFormId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads2.add(obj);
						continue;
					}
				}
				
				String subReportPath = getRequest().getRealPath("/pages/reportTemplet/redHead/");
				subReportPath = subReportPath.replace('\\', '/');
				System.out.println("leaderReads1:"+leaderReads1);
				params.put("SUBREPORT_DIR",subReportPath+"/");
				params.put("subReportDataList", leaderReads1);
				
				params.put("SUBREPORT_DIR2",subReportPath+"/");
				params.put("subReportDataList2", leaderReads2);
				
			}
		}
		return SUCCESS;
	}
	
	/**
	 * 红头文件-会议纪要
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getRedHeadHYJY() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			//议题名称
			params.put("subject", archives.getSubject());
			//回报人
			params.put("issuer", archives.getIssuer());
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issueDate", archives.getIssueDate().toLocaleString());
			//其他参会单位或部门
			params.put("recDepNames", archives.getRecDepNames());
			//主要内容
			params.put("shortContent", archives.getShortContent());
			params.put("archivesNo", archives.getArchivesNo());
			
			params.put("privacyLevel", archives.getPrivacyLevel());
			
			List<LeaderRead> leaderReads1 = new ArrayList();
			List<LeaderRead> leaderReads2 = new ArrayList();
			ProcessRun processRun=archives.getProcessRun();
			Short runStatus= processRun.getRunStatus();
			String imagePath = getRequest().getRealPath("/attachFiles/");
			imagePath = imagePath.replace('\\', '/');
			if(runStatus == 2){
				List pfList=processFormService.getByRunId(archives.getProcessRun().getRunId());
				String namePicPath = null;
				for(Object o : pfList){
					ProcessForm  pf1 = (ProcessForm)o;
					namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
					LeaderRead obj = new LeaderRead();
					if(pf1!= null && pf1.getActivityName().equals("室经理审核")){
						obj.setReadId(pf1.getFormId());
						obj.setLeaderName(this.getLeaderName(pf1.getCreatorId()));
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads1.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("部门分管负责人审核")){
						obj.setReadId(pf1.getFormId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads1.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("相关部门部长意见")){
						obj.setReadId(pf1.getFormId());
						namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads1.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("分管领导审核")){
						obj.setReadId(pf1.getFormId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads2.add(obj);
						continue;
					}
					if(pf1!= null && pf1.getActivityName().equals("总经理审批")){
						obj.setReadId(pf1.getFormId());
						if(namePicPath != null){
							obj.setLeaderNamePic(imagePath+"/"+namePicPath);
						}else {
							obj.setLeaderName(pf1.getCreatorName());
						}
						obj.setLeaderOpinion(pf1.getComments());
						obj.setDepName(this.getDepName(pf1.getCreatorId()));
						obj.setCreatetime(pf1.getCreatetime());
						obj.setCheckName(pf1.getActivityName());
						leaderReads2.add(obj);
						continue;
					}
				}
				
				String subReportPath = getRequest().getRealPath("/pages/reportTemplet/redHead/");
				subReportPath = subReportPath.replace('\\', '/');
				System.out.println("leaderReads1:"+leaderReads1);
				params.put("SUBREPORT_DIR",subReportPath+"/");
				params.put("subReportDataList", leaderReads1); 
				System.out.println("sys:"+leaderReads1.get(0));
				
				params.put("SUBREPORT_DIR2",subReportPath+"/");
				params.put("subReportDataList2", leaderReads2);
				
			}
		}
		return SUCCESS;
	}
	
	/**
	 * 红头文件
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getRedHead() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			//议题名称
			params.put("subject", archives.getSubject());
			//回报人
			params.put("issuer", archives.getIssuer());
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issueDate", archives.getIssueDate().toLocaleString());
			//其他参会单位或部门
			params.put("recDepNames", archives.getRecDepNames());
			//主要内容
			params.put("shortContent", archives.getShortContent());
			params.put("archivesNo", archives.getArchivesNo());
			
			params.put("privacyLevel", archives.getPrivacyLevel());
			List<LeaderRead> leaderReads = new ArrayList(archives.getLeaders());
			List<LeaderRead> leaderReads2 = new ArrayList<LeaderRead>();
			ListComparator c = new ListComparator("getReadId");
			Collections.sort(leaderReads, c);
			
			if(null != leaderReads) {
				for(LeaderRead obj:leaderReads){
					if(!obj.getCheckName().equals("发文拟稿") || !obj.getCheckName().equals("行政事务部编号复核套红") ){
						leaderReads2.add(obj);
					}
				}
			}
			leaderReadDataSource = leaderReads2;
		}
		return SUCCESS;
	}
	
	/**
	 * 运营公司发总公司文(请示)
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getRedHeadQingShi() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			//议题名称
			params.put("subject", archives.getSubject());
			//回报人
			params.put("issuer", archives.getIssuer());
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issueDate", archives.getIssueDate().toLocaleString());
			//其他参会单位或部门
			params.put("recDepNames", archives.getRecDepNames());
			//主要内容
			params.put("shortContent", archives.getShortContent());
			params.put("archivesNo", archives.getArchivesNo());
			
			params.put("privacyLevel", archives.getPrivacyLevel());
			ListComparator c = new ListComparator("getReadId");
			List<LeaderRead> leaderReads = new ArrayList(archives.getLeaders());
			Collections.sort(leaderReads, c);
			leaderReadDataSource = leaderReads;
		}
		return SUCCESS;
	}
	
	/**
	 * 内部工作联系单
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getInnerWorkConnSend() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		//编号
		params.put("archivesNo", archives.getArchivesNo());
		
		//主送
		params.put("issuer", archives.getIssuer());
		//抄报
		if (null != archives) {
			Set<AppUser> archivesCC = archives.getArchivesCCs();
			List<AppUser> archivesCCList = new ArrayList<AppUser>();
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L39999")){
					archivesCCList.add(au);
				}
			}
			/*for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L30024")){
					archivesCCList.add(au);
				}
			}*/
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L30025")){
					archivesCCList.add(au);
				}
			}
			//start xt
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L00097")){
					archivesCCList.add(au);
				}
			}
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L000086")){
					archivesCCList.add(au);
				}
			}
			//end xt
			String ccNames = "";
			if (!(archivesCCList == null||archivesCCList.isEmpty())) {
				for (AppUser au : archivesCCList) {
					ccNames = ccNames + au.getFullname();
					ccNames = ccNames + ",";
				}
				ccNames=ccNames.substring(0, ccNames.length() - 1);
			}
			
			//标题
			params.put("subject", archives.getSubject());

			//联系是由
			params.put("shortContent", archives.getShortContent());
			
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issuedate", archives.getIssueDate().toLocaleString());
			
			//抄报
			params.put("copyto", ccNames);
			//紧急程度
			params.put("urgentLevel", archives.getUrgentLevel());
			//主送
			params.put("recDepNames", archives.getRecDepNames());
			
			String imagePath = getRequest().getRealPath("/attachFiles/");
			imagePath = imagePath.replace('\\', '/');
			System.out.println("subReportPath:"+imagePath);
			
			
			ProcessRun processRun=archives.getProcessRun();
			Short runStatus= processRun.getRunStatus();
			if(runStatus == 2){
				String namePicPath = null;
				ProcessForm  pf = processFormService.getByRunIdActivityName(processRun.getRunId(),"室经理审核");
				if(pf !=null){
					//params.put("manager", this.getLeaderName(pf.getCreatorId()));
					
					namePicPath = odPersonalSignService.getOdPersonSign(pf.getCreatorId());
					if(namePicPath != null){
						params.put("imagePath2",imagePath+"/"+namePicPath);
					}else {
						params.put("manager", this.getLeaderName(pf.getCreatorId()));
					}
				}
				
				
				ProcessForm  pf1 = processFormService.getByRunIdActivityName(processRun.getRunId(),"部门分管负责人审核");
				if(pf1 !=null){
					//params.put("chargeperson", this.getLeaderName(pf1.getCreatorId()));
					namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
					if(namePicPath != null){
						params.put("imagePath",imagePath+"/"+namePicPath);
					}else {
						params.put("chargeperson", this.getLeaderName(pf1.getCreatorId()));
					}
				}
				System.out.println("namePicPath:"+namePicPath);
			}
		}
		return SUCCESS;
	}
	
	/**
	 * 内部工作联系单收文
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getInnerWorkConnSendReceive() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		
		Long parentArcId = archives.getParentArchId();
		Archives parentArchives = archivesService.get(parentArcId);
		//获取对应的发文流程
		
		//编号
		params.put("archivesNo", archives.getArchivesNo());
		
		//主送
		params.put("issuer", archives.getIssuer());
		//抄报
		if (null != archives) {
			Set<AppUser> archivesCC = parentArchives.getArchivesCCs();
			List<AppUser> archivesCCList = new ArrayList<AppUser>();
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L39999")){
					archivesCCList.add(au);
				}
			}
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L30025")){
					archivesCCList.add(au);
				}
			}
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L00097")){
					archivesCCList.add(au);
				}
			}
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L000086")){
					archivesCCList.add(au);
				}
			}
			String ccNames = "";
			if (!(archivesCCList == null||archivesCCList.isEmpty())) {
				for (AppUser au : archivesCCList) {
					ccNames = ccNames + au.getFullname();
					ccNames = ccNames + ",";
				}
				ccNames=ccNames.substring(0, ccNames.length() - 1);
			}
			//标题
			params.put("subject", archives.getSubject());

			//联系是由
			params.put("shortContent", archives.getShortContent());
			
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issuedate", archives.getIssueDate().toLocaleString());
			
			//抄报
			params.put("copyto", ccNames);
			//紧急程度
			params.put("urgentLevel", archives.getUrgentLevel());
			//主送
			params.put("recDepNames", archives.getRecDepNames());
			
			String imagePath = getRequest().getRealPath("/attachFiles/");
			imagePath = imagePath.replace('\\', '/');
			System.out.println("subReportPath:"+imagePath);
			List<LeaderRead> leaderReads = new ArrayList();
			ProcessRun processRun=parentArchives.getProcessRun();
			Short runStatus= processRun.getRunStatus();
			if(runStatus == 2){
			
				ProcessForm  pf = processFormService.getByRunIdActivityName(processRun.getRunId(),"室经理审核");
				String namePicPath = null;
				if(pf!=null){
					//params.put("manager", this.getLeaderName(pf.getCreatorId()));
					namePicPath = odPersonalSignService.getOdPersonSign(pf.getCreatorId());
					if(namePicPath != null){
						params.put("imagePath2",imagePath+"/"+namePicPath);
					}else{
						params.put("manager", this.getLeaderName(pf.getCreatorId()));
					}
				}
				
				ProcessForm  pf1 = processFormService.getByRunIdActivityName(processRun.getRunId(),"部门分管负责人审核");
				if(pf1!=null){
					//params.put("chargeperson", this.getLeaderName(pf1.getCreatorId()));
					namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
					if(namePicPath != null){
						params.put("imagePath",imagePath+"/"+namePicPath);
					}else {
						params.put("chargeperson", this.getLeaderName(pf1.getCreatorId()));
					}
				}
				
				List pfList=processFormService.getByRunId(archives.getProcessRun().getRunId());
				
				for(Object o : pfList){
					ProcessForm  pf2 = (ProcessForm)o;
					if(!pf2.getActivityName().equals("开始")){
						LeaderRead obj = new LeaderRead();
						obj.setReadId(pf2.getFormId());
						obj.setLeaderName(this.getLeaderName(pf2.getCreatorId()));
						obj.setLeaderOpinion(pf2.getComments());
						obj.setDepName(this.getDepName(pf2.getCreatorId()));
						obj.setCreatetime(pf2.getCreatetime());
						leaderReads.add(obj);
					}
					
				}
			}
			
			
			
			
			ListComparator c = new ListComparator("getReadId");
			Collections.sort(leaderReads, c);

			String subReportPath = getRequest().getRealPath("/pages/reportTemplet/innerCommunicationReceive/");
			subReportPath = subReportPath.replace('\\', '/');
			System.out.println("subReportPath:"+subReportPath);
			params.put("SUBREPORT_DIR",subReportPath+"/");
			params.put("subReportDataList", leaderReads);
			
		}
		return SUCCESS;
	}
	/**
	 * 运营公司对总公司发文(工作联系单)旧版
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getWorkConnOldSend() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			Set<AppUser> archivesCC = archives.getArchivesCCs();
			List<AppUser> archivesCCList = new ArrayList<AppUser>();
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L39999")){
					archivesCCList.add(au);
				}
			}
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L30025")){
					archivesCCList.add(au);
				}
			}
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L00097")){
					archivesCCList.add(au);
				}
			}
			for (AppUser au : archivesCC) {
				if(au.getUsername().equals("L000086")){
					archivesCCList.add(au);
				}
			}
			String ccNames = "";
			if (!(archivesCCList == null||archivesCCList.isEmpty())) {
				for (AppUser au : archivesCCList) {
					ccNames = ccNames + au.getFullname();
					ccNames = ccNames + ",";
				}
				ccNames=ccNames.substring(0, ccNames.length() - 1);
			}
			
			//议题名称
			params.put("subject", archives.getSubject());
			//回报人
			params.put("issuer", archives.getIssuer());
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issuedate", archives.getIssueDate().toLocaleString());
			
			//抄报
			params.put("copyto", ccNames);
			//紧急程度
			params.put("urgentLevel", archives.getUrgentLevel());
			
			//联系是由
			params.put("shortContent", archives.getShortContent());
			params.put("archivesNo", archives.getArchivesNo());
			//主送
			params.put("recDepNames", archives.getRecDepNames());
			
			List<LeaderRead> leaderReads = new ArrayList(archives.getLeaders());
			if(null != leaderReads) {
				for(LeaderRead obj:leaderReads){
					if(obj.getCheckName().equals("部门部长审核")){
						params.put("manager", obj.getLeaderName());
					}else if(obj.getCheckName().equals("分管领导审核")){
						params.put("fgManager", obj.getLeaderName());
					}
				}
			}
			/*Collections.sort(leaderReads, c);
			String subReportPath = getRequest().getRealPath("/pages/reportTemplet/fileHuiqian/");
			subReportPath = subReportPath.replace('\\', '/');
			System.out.println("subReportPath:"+subReportPath);
			params.put("SUBREPORT_DIR",subReportPath+"/");
			params.put("subReportDataList", leaderReads);*/
		
		}
		return SUCCESS;
	}
	
	/**
	 * 运营公司对总公司发文(工作联系单)
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getWorkConnSend() {
		Archives archives = archivesService.getArchivesByRunId(runId);
		if (null != archives) {
			
			
			//议题名称
			params.put("subject", archives.getSubject());
			//回报人
			params.put("issuer", archives.getIssuer());
			//提交部门
			params.put("issueDep", archives.getIssueDep());
			//会议日期
			params.put("issuedate", archives.getIssueDate().toLocaleString());
			
			//抄报
			params.put("copyto", archives.getHandlerUnames());
			//紧急程度
			params.put("urgentLevel", archives.getUrgentLevel());
			
			//联系是由
			params.put("shortContent", archives.getShortContent());
			params.put("archivesNo", archives.getArchivesNo());
			//主送
			params.put("recDepNames", archives.getRecDepNames());
			String logoPath = getRequest().getRealPath("/images/");
			logoPath = logoPath.replace('\\', '/');
			params.put("logoImage",logoPath+"/"+"comPanyLogo.jpg");
			System.out.println("logoPath:"+logoPath);
			String imagePath = getRequest().getRealPath("/attachFiles/");
			imagePath = imagePath.replace('\\', '/');
			System.out.println("subReportPath:"+imagePath);
			
			ProcessRun processRun=archives.getProcessRun();
			Short runStatus= processRun.getRunStatus();
			if(runStatus == 2){
				ProcessForm  pf = processFormService.getByRunIdActivityName(archives.getProcessRun().getRunId(),"部门分管负责人审核");
				//params.put("manager", pf.getCreatorName());
				String namePicPath = null;
				namePicPath = odPersonalSignService.getOdPersonSign(pf.getCreatorId());
				if(namePicPath != null){
					params.put("imagePath1",imagePath+"/"+namePicPath);
				}else {
					params.put("manager", pf.getCreatorName());
				}
				ProcessForm  pf1 = processFormService.getByRunIdActivityName(archives.getProcessRun().getRunId(),"分管领导审批");
				//params.put("fgManager",pf1.getCreatorName());
				namePicPath = odPersonalSignService.getOdPersonSign(pf1.getCreatorId());
				if(namePicPath != null){
					params.put("imagePath2",imagePath+"/"+namePicPath);
				}else{
					params.put("fgManager",pf1.getCreatorName());
				}
			}
		}
		return SUCCESS;
	}
	

	
	
	@SuppressWarnings("unchecked")
	public String getCarApplyReport() {
		CarApply carApply = carApplyService.getCarApplyByRunId(runId);
		if (null != carApply) {
			//申请人
			params.put("proposer", carApply.getProposer());	
			//用车人
			params.put("userFullName", carApply.getUserFullname());	
			//所属部门
			params.put("department", carApply.getDepartment());					
			//出发地
			params.put("fromSite", carApply.getFromSite());	
			//目的地
			params.put("toSite", carApply.getToSite());	
			//乘车人数
			params.put("peopleAmount", String.valueOf(carApply.getPeopleAmount()));	
			//用车是由
			params.put("reason", carApply.getReason());	
			//用车备注
			params.put("notes", carApply.getNotes());	
			//车牌号码
			params.put("carNo", carApply.getCarNo());	
			//司机姓名
			params.put("driver", carApply.getDriver());	
			//是否长期有效
			params.put("isLong", (carApply.getIseffective()==1?"不是":"是"));
			//是否需要司机
			params.put("needDriver", (carApply.getIshavecardriver()==1?"需要":"不需要"));
			//开始时间
			//用车日期
			params.put("startDate", sdf.format(carApply.getStartTime()));	
			params.put("endDate",sdf.format(carApply.getEndTime()));
			
			if(carApply.getIseffective()==1){//不是长期有效
				//开始时间
				params.put("startTime", sdf_time.format(carApply.getStartTime()));	
				//结束时间
				params.put("endTime",sdf_time.format(carApply.getEndTime()));	
			}else{
				//开始时间
				params.put("startTime", carApply.getOnDutyTime());	
				//结束时间
				params.put("endTime",carApply.getOffDutyTime());				
			}
			if(carApply.getProcessRun().getRunStatus() == 2){
				ProcessForm  pf1 = processFormService.getByRunIdActivityName(carApply.getProcessRun().getRunId(),"部门主管审批");
				params.put("usrCarDepOpinion", pf1.getComments());
				params.put("usrCarDepName", pf1.getCreatorName());
				params.put("usrCarDepDate", sdf_date.format(pf1.getCreatetime()));
				ProcessForm  pf2 = processFormService.getByRunIdActivityName(carApply.getProcessRun().getRunId(),"行政部负责人审批");
				params.put("xzDepOpinion", pf2.getComments());
				params.put("xzDepName", pf2.getCreatorName());
				params.put("xzDepDate",sdf_date.format(pf2.getCreatetime()));
				ProcessForm  pf3 = processFormService.getByRunIdActivityName(carApply.getProcessRun().getRunId(),"分管领导审批");
				if(null != pf3){
					params.put("fgOpinion", pf3.getComments());
					params.put("fgName", pf3.getCreatorName());
					params.put("fgDate", sdf_date.format(pf3.getCreatetime()));
				}
				
			}
		}
		return SUCCESS;
	}
	public HashMap getParams() {
		return params;
	}
	
	public void setParams(HashMap params) {
		this.params = params;
	}
	
	public List<BasicDataSource> getDataSource() {
		return dataSource;
	}

	public void setDataSource(List<BasicDataSource> dataSource) {
		this.dataSource = dataSource;
	}

	public List<LeaderRead> getLeaderReadDataSource() {
		return leaderReadDataSource;
	}

	public void setLeaderReadDataSource(List<LeaderRead> leaderReadDataSource) {
		this.leaderReadDataSource = leaderReadDataSource;
	}
	
	public List<DoucmentReivewResponse> getDocumentDataSource() {
		return documentDataSource;
	}
	public void setDocumentDataSource(List<DoucmentReivewResponse> documentDataSource) {
		this.documentDataSource = documentDataSource;
	}
	public Long getRunId() {
		return runId;
	}
	public void setRunId(Long runId) {
		this.runId = runId;
	}
	public static void main(String[] args) {
		System.out.println(DateUtil.formatEnDate(new Date()));
	}
}
